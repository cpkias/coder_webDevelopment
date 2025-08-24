# Age Calculator

A simple, accessible web app to calculate your age in years, months, and days, and show time until your next birthday.

## Quick start

- Open `index.html` in your browser, or serve the folder:

```bash
cd /workspace/age-calculator
python3 -m http.server 8080
# then open http://localhost:8080
```

## Features

- Date picker limited to today or earlier
- Calendar-accurate age calculation (handles month lengths and leap years)
- Next birthday countdown (special handling for Feb 29)
- Minimal, responsive UI