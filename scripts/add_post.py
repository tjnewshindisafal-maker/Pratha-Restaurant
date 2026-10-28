#!/usr/bin/env python3
"""Add a blog post to blog/posts.js.

Usage: python3 scripts/add_post.py path/to/post.json

The JSON file must hold one post object with these fields:
  slug, title, date (YYYY-MM-DD), category, emoji, excerpt, readMins, body
`body` is plain text with a small Markdown subset: "## " / "### " headings,
"- " list items, **bold**, *italic*, and blank lines between paragraphs.
"""
import datetime
import json
import re
import sys
from pathlib import Path

POSTS_FILE = Path(__file__).resolve().parent.parent / "blog" / "posts.js"
PREFIX = "window.BLOG_POSTS = "
REQUIRED = {
    "slug": str,
    "title": str,
    "date": str,
    "category": str,
    "emoji": str,
    "excerpt": str,
    "readMins": int,
    "body": str,
}


def load_posts():
    text = POSTS_FILE.read_text(encoding="utf-8").strip()
    if not text.startswith(PREFIX) or not text.endswith(";"):
        sys.exit(f"{POSTS_FILE} is not in the expected format")
    return json.loads(text[len(PREFIX):-1])


def save_posts(posts):
    body = json.dumps(posts, indent=2, ensure_ascii=False)
    POSTS_FILE.write_text(f"{PREFIX}{body};\n", encoding="utf-8")


def validate(post, existing):
    for key, kind in REQUIRED.items():
        if not isinstance(post.get(key), kind) or (kind is str and not post[key].strip()):
            sys.exit(f"Field '{key}' is missing or not a {kind.__name__}")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", post["slug"]):
        sys.exit("slug must be lowercase words joined by hyphens")
    try:
        datetime.date.fromisoformat(post["date"])
    except ValueError:
        sys.exit("date must be YYYY-MM-DD")
    if any(p["slug"] == post["slug"] for p in existing):
        sys.exit(f"A post with slug '{post['slug']}' already exists")
    if len(post["body"]) < 600:
        sys.exit("body is too short (under 600 characters)")


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    post = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
    posts = load_posts()
    validate(post, posts)
    post = {key: post[key] for key in REQUIRED}
    posts.append(post)
    posts.sort(key=lambda p: p["date"], reverse=True)
    save_posts(posts)
    print(f"Added '{post['title']}' ({post['date']}). Total posts: {len(posts)}")


if __name__ == "__main__":
    main()
