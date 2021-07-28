# **LeftWat**

Whenever you’re at the supermarket, don’t you often find yourself racking your brains to recall what grocery items you still have stocked at home? Literally... **_left wat_** ?!

LeftWat is here to be the grocery shopping companion you’ve always needed!

Simply upload a copy of your receipt, and let LeftWat do the rest.

LeftWat is a web-based app designed to help users keep track of their grocery purchases and their fridge inventories to help them make informed grocery decisions with ease! Users simply have to upload a copy of their grocery receipts in any image or pdf formats, and LeftWat will swiftly process and save that information into the user’s inventory data! Users can at any point in time edit their fridge inventory data (e.g. delete a product if it’s been consumed or used) and view historical information on products to track the prices paid for these items to make better informed grocery decisions!

- **Heroku**: [App](url)
- **GitHub**: [Frontend](https://github.com/yilinghuam/leftwat-fe), [Backend](https://github.com/yilinghuam/leftwat-be)

## Technologies Used

### Wireframe:
* Adobe XD: [Wireframe](https://xd.adobe.com/view/1595919e-f524-4992-9739-8eec2f6d9486-40c6/)
*Trello for project tasks and timeline tracking

### Frontend:
* ReactJS - JavaScript library for building user interfaces
* Materialize CSS - Responsive CSS framework
* ChartJS - Display simple and engaging JavaScript charts
	* React-toastify - Add notifications in app
	* Axios - Promise-based HTTP Client for browser and NodeJS
* Google fonts - Library of fonts

### Backend:
* Veryfi OCR API - Optical Character Recognition tool to read receipts
* ExpressJS - Web application framework for NodeJS
* MongoDB - Database to store JSON-like documents with dynamic schema
* NodeJS - Open-source and cross-platform JavaScript runtime environment
* Cloudinary - Cloud storage of uploaded images
* Multer - NodeJS middleware to handle file uploads
* bcrypt - Password hashing function
* JWT - Standard for conveying some data between backend and frontend applications

## Approach Taken

The team split up into duos to handle frontend and backend separately, using Trello as our project management tool. We collaborated through github regularly and had our respective partners review our branches before commits were merged onto the main branches. Standup meetings were done at the start of every coding session to check on each member’s progress, and to segregate next tasks. We also assigned a Tech Lead (Yiling) who had an overview of the entire project to ensure that frontend and backend work were aligned, as well as control the integrations between frontend and backend.

For backend, we split the work between the two main databases needed: User and Product.
1. Users - Draw up wireframe of the entire backend system, create all User-related routes and User mongoDB collection, handle User authentication, and handle all app features that require User-related filters (e.g. tracking User inventory).
2. Products - Create Product-related routes and Product mongoDB collection, integrate Product-side middlewares such as Cloudinary to upload receipts, and OCR API to process uploaded receipts into json data for mongoDB, and handle receipt tracking.

For frontend, we started with coming up with the visual layouts first, followed by coding the components, before working on the logic of how the user interacts with the app. We also split the work by pages, largely by User functions (registration, login, cookies etc.) and Product/User-Product cross-functions (e.g. dashboard, pricing charts, etc.). We also opted for ‘functions’ instead of ‘class’ for better efficiency, and to keep up with industry trends/standards (since ‘class’ is being phased out).

## Wireframe Samples

![Landing Page and Signup](/public/image/landing.png "Landing Page and Signup")
![Inventory Page](/public/image/inventory.png "Inventory Page")
![Price Comparison Page](/public/image/price_comparison.png "Price Comparison Page")

## Unsolved Problems

- OCR API: We decided to focus on a single merchant template (i.e. RedMart) and did not try receipts/invoices from other merchants to see if the feature works across receipt/invoices types.
- Security concerns regarding JWT practices and cookie storage/usage: Currently our login cookie is only stored in the frontend. However, as a better security measure, cookies should always be stored in both frontend and backend so that the system can compare and only authenticate users when frontend and backend cookies match.
- We wanted to do single-page app but were unable to do so (due to the complexities), hence we proceeded with a multi-page app.

## User Stories
