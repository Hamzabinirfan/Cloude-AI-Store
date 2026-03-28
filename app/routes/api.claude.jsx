import Anthropic from "@anthropic-ai/sdk";
import { authenticate } from "../shopify.server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function action({ request }) {
  const { admin } = await authenticate.admin(request);
  const { question } = await request.json();

  const productsRes = await admin.graphql(`
    query {
      products(first: 10) {
        edges {
          node {
            id
            title
            status
            totalInventory
            priceRange {
              minVariantPrice { amount currencyCode }
            }
          }
        }
      }
    }
  `);

  const ordersRes = await admin.graphql(`
    query {
      orders(first: 10) {
        edges {
          node {
            id
            name
            displayFinancialStatus
            displayFulfillmentStatus
            totalPrice
            customer { firstName lastName email }
          }
        }
      }
    }
  `);

  const productsData = await productsRes.json();
  const ordersData = await ordersRes.json();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `
Tu ek Shopify store assistant hai JPC Equestrian Inc ka.

Store ka current data:
PRODUCTS: ${JSON.stringify(productsData.data.products.edges)}
ORDERS: ${JSON.stringify(ordersData.data.orders.edges)}

Sawaal: ${question}

Jawab Hindi ya English mein do, clearly aur helpfully.
        `,
      },
    ],
  });

  return Response.json({ answer: message.content[0].text });
}