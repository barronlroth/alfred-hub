#!/usr/bin/env python3
"""Validate the static minimoon dataset and local runtime surface."""
from __future__ import annotations

import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data" / "hotels.json"
SOURCE_FILES = [ROOT / "research" / name for name in ("cayman.json", "hawaii.json", "westcoast.json")]
REQUIRED = {
    "slug", "name", "location", "region", "rankTier", "role", "summary", "bestRoom",
    "nightlyRange", "sixNightRange", "priceConfidence", "priceNote", "weather", "weatherRisk",
    "route", "travelFriction", "attributes", "honestCatch", "quote", "bookingUrl", "officialUrl",
    "images", "editorialRank", "collection"
}
ATTRIBUTE_KEYS = {"romance", "privacy", "service", "foodSpa", "activities", "weather"}
IMAGE_KEYS = {"localPath", "sourceUrl", "sourceName", "caption", "alt"}
CONFIDENCE = {"exact-date", "adjacent-date", "generic-rate-signal", "generic-signal", "estimate"}


class RuntimeRefs(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        for key in ("src", "href"):
            value = values.get(key)
            if value and not urlparse(value).scheme and not value.startswith(("#", "data:")):
                self.refs.append(value.split("?", 1)[0])


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def main() -> int:
    errors: list[str] = []
    payload = json.loads(DATA.read_text(encoding="utf-8"))
    hotels = payload.get("hotels", [])
    source_hotels = []
    for path in SOURCE_FILES:
        source_hotels.extend(json.loads(path.read_text(encoding="utf-8")))

    if len(hotels) != 25:
        fail(errors, f"expected 25 hotels, found {len(hotels)}")
    if len({h.get('slug') for h in hotels}) != len(hotels):
        fail(errors, "hotel slugs are not unique")
    if {h.get("slug") for h in hotels} != {h.get("slug") for h in source_hotels}:
        fail(errors, "published hotel slugs do not match the three source datasets")

    ranked = [h for h in hotels if h.get("collection") == "ranked"]
    explore = [h for h in hotels if h.get("collection") == "explore"]
    if len(ranked) != 10 or len(explore) != 15:
        fail(errors, f"expected 10 ranked and 15 explore hotels, found {len(ranked)} and {len(explore)}")
    if sorted(h.get("editorialRank") for h in ranked) != list(range(1, 11)):
        fail(errors, "editorial ranks must be the unique integers 1 through 10")

    image_count = 0
    for hotel in hotels:
        slug = hotel.get("slug", "<unknown>")
        missing = REQUIRED - hotel.keys()
        if missing:
            fail(errors, f"{slug}: missing fields {sorted(missing)}")
        if hotel.get("priceConfidence") not in CONFIDENCE:
            fail(errors, f"{slug}: invalid price confidence")
        for key in ("nightlyRange", "sixNightRange"):
            values = hotel.get(key)
            if not isinstance(values, list) or len(values) != 2 or not all(isinstance(v, (int, float)) for v in values) or values[0] > values[1]:
                fail(errors, f"{slug}: invalid {key}")
        attrs = hotel.get("attributes", {})
        if set(attrs) != ATTRIBUTE_KEYS or any(not isinstance(v, int) or not 1 <= v <= 10 for v in attrs.values()):
            fail(errors, f"{slug}: invalid attributes")
        quote = hotel.get("quote", {})
        if not all(quote.get(key) for key in ("text", "sourceName", "url")):
            fail(errors, f"{slug}: incomplete quote")
        images = hotel.get("images", [])
        if len(images) != 3:
            fail(errors, f"{slug}: expected 3 images, found {len(images)}")
        image_count += len(images)
        for index, image in enumerate(images, 1):
            if IMAGE_KEYS - image.keys() or not all(image.get(key) for key in IMAGE_KEYS):
                fail(errors, f"{slug} image {index}: incomplete metadata")
            local = ROOT / image.get("localPath", "")
            if not local.is_file() or local.stat().st_size == 0:
                fail(errors, f"{slug} image {index}: missing asset {local.relative_to(ROOT)}")

    if image_count != 75:
        fail(errors, f"expected 75 image records, found {image_count}")

    parser = RuntimeRefs()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    for ref in parser.refs:
        if not (ROOT / ref).is_file():
            fail(errors, f"HTML references missing local file: {ref}")
    for runtime in ("index.html", "styles.css", "app.js", "data/hotels.json"):
        if not (ROOT / runtime).is_file():
            fail(errors, f"missing runtime file: {runtime}")

    css = (ROOT / "styles.css").read_text(encoding="utf-8").lower()
    if "gradient(" in css:
        fail(errors, "CSS contains a prohibited gradient")

    if errors:
        print("VALIDATION FAILED")
        for error in errors:
            print(f"  - {error}")
        return 1

    print("VALIDATION PASSED")
    print("  hotels: 25 (10 ranked, 15 explore)")
    print("  images: 75 local assets with complete source metadata")
    print(f"  runtime references: {len(parser.refs)} local files present")
    print("  required fields, ranges, attributes, ranks, and source parity: valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
