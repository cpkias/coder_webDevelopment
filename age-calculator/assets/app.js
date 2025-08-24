(function () {
  'use strict';

  const form = document.getElementById('age-form');
  const input = document.getElementById('dob');
  const result = document.getElementById('result');

  // Set max to today to prevent future dates via picker
  const today = new Date();
  input.max = today.toISOString().slice(0, 10);

  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }

  function calculateAge(fromDate, toDate) {
    // Returns an object with years, months, days between two dates
    // Compute using calendar arithmetic, not fixed days per month
    const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    const end = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

    if (end < start) {
      return null;
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      // Borrow days from previous month
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    return { years, months, days };
  }

  function nextBirthday(fromDate, now) {
    const thisYearBirthday = new Date(now.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    let next = thisYearBirthday >= new Date(now.getFullYear(), now.getMonth(), now.getDate())
      ? thisYearBirthday
      : new Date(now.getFullYear() + 1, fromDate.getMonth(), fromDate.getDate());

    // Handle Feb 29 birthdays on non-leap years: use Mar 1 as conventional
    if (fromDate.getMonth() === 1 && fromDate.getDate() === 29 && next.getMonth() !== 1) {
      next = new Date(next.getFullYear(), 2, 1);
    }
    return next;
  }

  function diffInMonthsDays(start, end) {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth() + years * 12;
    let days = end.getDate() - start.getDate();
    if (days < 0) {
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
      months -= 1;
    }
    return { months, days };
  }

  function formatResult(age, bdayDiff) {
    const lines = [];
    lines.push(`You are ${age.years} years, ${age.months} months, and ${age.days} days old.`);
    lines.push(`That is about ${(age.years * 12 + age.months) || 0} months old.`);
    lines.push(`Next birthday in ${bdayDiff.months} months and ${bdayDiff.days} days.`);
    return `<div class=\"success\">${lines[0]}</div><div class=\"details\">${lines.slice(1).join('<br>')}</div>`;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const value = input.value;
    result.textContent = '';

    if (!value) {
      result.innerHTML = '<div class="error">Please enter your date of birth.</div>';
      return;
    }

    const dob = new Date(value + 'T00:00:00');
    if (!isValidDate(dob)) {
      result.innerHTML = '<div class="error">Invalid date.</div>';
      return;
    }

    const now = new Date();
    const age = calculateAge(dob, now);
    if (!age) {
      result.innerHTML = '<div class="error">Date must be in the past.</div>';
      return;
    }

    const next = nextBirthday(dob, now);
    const untilNext = diffInMonthsDays(new Date(now.getFullYear(), now.getMonth(), now.getDate()), next);
    result.innerHTML = formatResult(age, untilNext);
  });
})();