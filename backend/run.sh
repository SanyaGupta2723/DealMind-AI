#!/bin/bash
cd "$(dirname "$0")"
uv sync
uv run main.py
