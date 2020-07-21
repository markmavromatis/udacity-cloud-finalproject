# Property Mogul Master 

This application is for aspiring property moguls everywhere! 

The web interface allows users to add condominiums and their details (price, fees, taxes, photo, etc) to a list. Controls at the top of the list allow the aspiring property mogul to enter a down-payment amount and a loan interest rate. Then, as if by magic (!), the montly payment amounts will appear next to all properties. 

This application is useful for prospective buyers who wish to compare the financial burden of purchasing properties with different prices, fees, and taxes.

## Installation steps

After cloning this repository to your local workstation, start up the web application by navigating to the client/ folder and running the following commands:

1. `npm install` - Loads dependencies
2. `npm start` - Starts the web server


## Instructions

After the web server has launched, navigate a web browser to http://localhost:3000 and sign up for a new account by clicking the "Log In" button on the upper right corner of the application.

Click the "Add Property" button to start registering properties.

Three icons will appear next to each property. These icons allow users to:

1. Edit Property
2. Upload Image
3. Delete Property

Images will be displayed next to each property when provided.

At the top of the screen, two fields appear for Mortgage Interest Rate and Down Payment. The default values are 3% and $500,000. Updating these fields will update the "Monthly" column with the respective monthly payment due on a 30-year fixed rate mortgage.

