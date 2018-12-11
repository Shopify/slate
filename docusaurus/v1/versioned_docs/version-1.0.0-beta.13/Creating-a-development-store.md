---
id: version-1.0.0-beta.13-how-to-create-a-development-store
title: How to create a development store
original_id: how-to-create-a-development-store
---

Since you can’t run the Shopify platform locally on your computer, everything needs to live on Shopify’s servers. To [start developing and testing your theme](start-developing), you will first need to create a Shopify development store. The easiest way to create a development store is through a Shopify Partner Account.

## Partner account

As a [Shopify Partner](https://www.shopify.ca/partners/program-features), you can create an unlimited number of development stores. A development store is a free Shopify account that comes with a couple of limitations. You can use a development store to test any theme that you create, or to set up a Shopify account for a client.

### How to create a partner account

1. Visit the Shopify Partner Program page
2. Enter your email and fill out the form
   ![](https://user-images.githubusercontent.com/6691035/47668740-a3309600-db7f-11e8-9e38-82b0825255da.png)
3. Create a new partner account and fill out the form
   ![](https://user-images.githubusercontent.com/6691035/47668829-d5da8e80-db7f-11e8-9a2d-71690b6baeb2.png)
4. You are now ready to create your first development store!
   ![](https://user-images.githubusercontent.com/6691035/47668885-fc98c500-db7f-11e8-9403-a4e6960b7553.png)

## Filling your store with content

Once you have your Partner account and your development store running, you will want to fill your store with dummy data. While you can add content manually, Shopify offers some tools to automate that task.

### Shopify Developer Tools

Shopify has create their own [developer tools app](https://www.shopify.com/partners/blog/developer-tools) (only available to macOS users) to help you build faster with Shopify. One of the many features is the ability to [generate dummy data](https://github.com/shopifypartners/developer-tools#data-generator).

#### Generating dummy data

1. Follow the instructions to [install the app](https://github.com/shopifypartners/developer-tools#installation)
2. Once the application is installed and you are authenticated, you can search for `Data generator`
   ![](https://user-images.githubusercontent.com/6691035/47668968-2d78fa00-db80-11e8-88b8-673212a9cc5f.png)
3. Fill in the different options and click on `Start`
   ![](https://user-images.githubusercontent.com/6691035/47669118-86e12900-db80-11e8-84ea-842761442d7b.png)

### CSV import

If you don't wish to download an app, Shopify also offers [Product CSV files](https://github.com/shopifypartners/product-csvs) as an alternative. There’s a great article on the Shopify Partners blog how on how to [import CSV files in your store](https://www.shopify.com.au/partners/blog/shopify-upload-products-csv).

Once content is added to your store, you can [connect it to your local development environment](connect-to-your-store) and [start developing](start-developing)!
