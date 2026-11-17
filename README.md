# CST3144 Coursework Front-End
## Overview
This repository contains the front-end implementation of a fictitious web app which allows students and parents to buy after-school classes and activities stored in MongoDB.

## Features
1. **Browse**

Users can browse the available lessons and activities, and view their related information, including the topic, category, type, price, location, instructor, availability, description, enrolment number, rating, number of ratings and the scheduled day and time.

Users can also save lessons and activities for later.

2. **Search & Filter**

Users can:
- Search for lessons or activities by title, location, price or availability.
- Filter items by lessons, activities or both.
- Sort lessons and activities in ascending or descending order based on the subject, location, price, available spaces or teacher.

3. **Login & Registration**

Users can register for an account or log in. Authentication is required to view saved items and order history, or to proceed to checkout.

4. **Shopping Cart & Checkout**

Users can add lessons and activities to their cart, adjust quantities and remove items. 

Before checkout, users must fill a form on the shopping cart page with a valid name (letters only) and phone number (numbers only). Once submitted, the order is recorded in the database.

**Note:** The shopping cart is not preserved when the page is refreshed.

5. **Order History & Ratings**

Logged-in users can view their previous orders and related information. They can also add or edit ratings for lessons and activities they have ordered.

## Libraries & Frameworks Used
- Vue.js (CDN)
- Bootstrap
- Font Awesome

## Running Application
The front-end is hosted on GitHub Pages. Access the application using the link below:

https://meganemdx.github.io/M01014266_CST3144_Vue/

**Recommended browser**: Google Chrome.

## Back-End
The back-end source code is available in the following repository and is hosted on Render:

https://github.com/meganeMDX/M01014266_CST3144_Express

## References

Debnath, A. (2026) *Debounce with Cancel in JavaScript*. Available at: https://www.ashishdebnath.in/blog/debounce-with-cancel (Accessed: 15 November 2026).

prabhatojha (2020) *How to pop up an alert box when the browser's refresh button is clicked?*. Available at: https://stackoverflow.com/a/64282126 (Accessed: 13 November 2026).

Vue.js (n.d.) *Routing*. Available at: https://vuejs.org/guide/scaling-up/routing.html (Accessed: 13 November 2026).

Yadav, A. (2025) *How to Optimize Search in JavaScript with Debouncing*. Available at: https://www.freecodecamp.org/news/optimize-search-in-javascript-with-debouncing/ (Accessed: 30 October 2026).