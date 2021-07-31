# **LeftWat**  :shopping_cart: :question:

Whenever you’re at the supermarket, don’t you often find yourself racking your brains to recall what grocery items you still have stocked at home? Literally... **_left wat_** ?!

LeftWat is here to be the grocery shopping companion you’ve always needed!

Simply upload a copy of your receipt, and let LeftWat do the rest.

LeftWat is a web-based app designed to help users keep track of their grocery purchases and their fridge inventories to help them make informed grocery decisions with ease! Users simply have to upload a copy of their grocery receipts in any image or pdf formats, and LeftWat will swiftly process and save that information into the user’s inventory data! Users can at any point in time edit their fridge inventory data (e.g. delete a product if it’s been consumed or used) and view historical information on products to track the prices paid for these items to make better informed grocery decisions!

- **Heroku**: [Frontend](https://leftwat-fe.herokuapp.com/), [Backend](https://leftwat-be.herokuapp.com/)
- **GitHub**: [Frontend](https://github.com/yilinghuam/leftwat-fe), [Backend](https://github.com/yilinghuam/leftwat-be)

## Technologies Used

### Wireframe:
- Adobe XD: [Wireframe](https://xd.adobe.com/view/1595919e-f524-4992-9739-8eec2f6d9486-40c6/)
- Trello for project tasks and timeline tracking

### Frontend:
- ReactJS - JavaScript library for building user interfaces
- Materialize CSS - Responsive CSS framework
- ChartJS - Display simple and engaging JavaScript charts
- React-toastify - Add notifications in app
- Axios - Promise-based HTTP Client for browser and NodeJS
- Google fonts - Library of fonts

### Backend:
- Veryfi OCR API - Optical Character Recognition tool to read receipts
- ExpressJS - Web application framework for NodeJS
- MongoDB - Database to store JSON-like documents with dynamic schema
- NodeJS - Open-source and cross-platform JavaScript runtime environment
- Cloudinary - Cloud storage of uploaded images
- Multer - NodeJS middleware to handle file uploads
- bcrypt - Password hashing function
- JWT - Standard for conveying some data between backend and frontend applications

## Approach Taken

The team split up into duos to handle frontend and backend separately, using Trello as our project management tool. We collaborated through github regularly and had our respective partners review our branches before commits were merged onto the main branches. Standup meetings were done at the start of every coding session to check on each member’s progress, and to segregate next tasks. We also assigned a Tech Lead (Yiling) who had an overview of the entire project to ensure that frontend and backend work were aligned, as well as control the integrations between frontend and backend.

For **backend**, we split the work between the two main databases needed: User and Product.
1. Users - Draw up wireframe of the entire backend system, create all User-related routes and User mongoDB collection, handle User authentication, and handle all app features that require User-related filters (e.g. tracking User inventory).
2. Products - Create Product-related routes and Product mongoDB collection, integrate Product-side middlewares such as Cloudinary to upload receipts, and OCR API to process uploaded receipts into json data for mongoDB, and handle receipt tracking.

For **frontend**, we started with coming up with the visual layouts first, followed by coding the components, before working on the logic of how the user interacts with the app. We also split the work by pages, largely by User functions (registration, login, cookies etc.) and Product/User-Product cross-functions (e.g. dashboard, pricing charts, etc.). We also opted for ‘functions’ instead of ‘class’ for better efficiency, and to keep up with industry trends/standards (since ‘class’ is being phased out).

## Wireframe Samples

![Landing Page and Signup](/public/images/landing.png "Landing Page and Signup")
![Inventory Page](/public/images/inventory.png "Inventory Page")
![Price Comparison Page](/public/images/price_comparison.png "Price Comparison Page")

## Unsolved Problems

- OCR API: We decided to focus on a single merchant template (i.e. RedMart) and did not try receipts/invoices from other merchants to see if the feature works across receipt/invoices types. **Update: works with Sheng Shiong
- Security concerns regarding JWT practices and cookie storage/usage: Currently our login cookie is only stored in the frontend. However, as a better security measure, cookies should always be stored in both frontend and backend so that the system can compare and only authenticate users when frontend and backend cookies match.
- We wanted to do single-page app but were unable to do so (due to the complexities), hence we proceeded with a multi-page app.
- Forgot password route

## User Stories

_“As a homemaker, I want to keep track of all my groceries with ease so that I may plan on what to purchase for my next grocery day.”_

_“As a cook, I would want to know what are the goods that are available in my fridge so that I can plan what kind of dishes I can prepare without going to the grocery store.”_

_“As a parent, I would want to keep track of all my spendings in groceries so that I know how much to budget for it as well as keeping track of what I spent. I would want to know the price trend so I know how much of the budget should I increase for the months to come by looking at the trend.”_

_“When I purchase groceries, I want to be able to have an overview of my fridge’s inventory so that I know which items need to be replenished.”_

| Blockers (what problem we are trying to solve)                                                                                                                          | Function to remove Blockers                                                                                                                                               |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| I have no idea what’s in my fridge                                                                                                                                      | Inventory page that shows all items currently in the fridge                                                                                                               |
| I have no idea how to keep track of what’s in my fridge                                                                                                                 | Database that stores information of all grocery items purchased; Inventory page allows users to delete items from inventory whenever needed (e.g. eaten, thrown, expired) |
| It’s tedious to record items one by one                                                                                                                                 | Upload image of receipt and app will automatically generate the discrete items purchased                                                                                  |
| I have no idea what I bought on my last grocery run                                                                                                                     | History page displays images of the last 5 receipts                                                                                                                       |
| I don’t have a record of the price changes for the items I usually buy; I want to know that I’m purchasing an item at a good price                                      | Price comparison feature allows user to compare historical prices by showing them a chart of item price by transaction date                                               |
| I’m not sure what kind of items I usually buy for consumption; knowing general food categories will help me understand my buying pattern, and better plan my diet needs | Dashboard shows user a pie chart of the item spread over three categories, ‘Meat’, ‘Vegetables’, and ‘Others’                                                             |


## Routes

| Main                    | Routes          | HTTP Method   | Description                                                                      |
|-------------------------|-----------------|:-------------:|----------------------------------------------------------------------------------|
| /api/v1/landing         | /register       | `POST`        | Register user account                                                            |
|                         | /login          | `POST`        | User login                                                                       |
|                         | /logout         | `POST`        | User logout                                                                      |
| /api/v1/upload          | /               | `POST`        | Upload receipt to Cloudinary, parse to Veryfi OCR, and save JSON data to MongoDB |
|                         | /confirm        | `GET`         | Retrieve data for user to edit and confirm uploaded receipt                      |
|                         | /confirm        | `PATCH`       | User logout                                                                      |
| /api/v1/inventory       | /               | `GET`         |  Retrieve data from inventory                                                    |
|                         | /               | `PATCH`       | Update changes made in database                                                  |
| /api/v1/dashboard       | /               | `GET`         | Retrieve user data                                                               |
|                         | /changepassword | `PATCH`       | Update change of password in database                                            |
|                         | /delete-receipt | `DELETE`      | Delete receipt from history page                                                 |
|                         | /pieData        | `GET`         | Retrieve items' data                                                             |
| /api/v1/pricecomparison | /               | `GET`         | Retrieve items' data                                                             |
|                         | /search         | `GET`         | Filter and show items' data                                                      |
