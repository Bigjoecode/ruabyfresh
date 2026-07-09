import { NextResponse } from "next/server";

/**
 * Nomba checkout session creator.
 *
 * Wire this to the client "Checkout with Nomba" button. It expects the cart
 * lines + total, then creates a Nomba online-checkout order and returns the
 * hosted checkout URL to redirect the customer to.
 *
 * Docs: https://docs.nomba.com  (Online Checkout / Payment)
 * Required env vars (see .env.example):
 *   NOMBA_CLIENT_ID, NOMBA_PRIVATE_KEY, NOMBA_ACCOUNT_ID
 */

type Line = { id: string; name: string; qty: number; price: number };

export async function POST(req: Request) {
  try {
    const { lines, total } = (await req.json()) as {
      lines: Line[];
      total: number;
    };

    if (!lines?.length || !total) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    const clientId = process.env.NOMBA_CLIENT_ID;
    const privateKey = process.env.NOMBA_PRIVATE_KEY;
    const accountId = process.env.NOMBA_ACCOUNT_ID;

    // If keys are not yet configured, fail gracefully so the UI can fall back.
    if (!clientId || !privateKey || !accountId) {
      return NextResponse.json(
        { error: "Nomba not configured", configured: false },
        { status: 501 }
      );
    }

    // 1) Obtain an access token
    const tokenRes = await fetch("https://api.nomba.com/v1/auth/token/issue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accountId,
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: privateKey,
      }),
    });
    const token = (await tokenRes.json())?.data?.access_token;

    // 2) Create the online checkout order
    const orderRes = await fetch(
      "https://api.nomba.com/v1/checkout/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accountId,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order: {
            orderReference: `RUABY-${Date.now()}`,
            customerId: "guest",
            callbackUrl: `${new URL(req.url).origin}/?paid=1`,
            currency: "NGN",
            amount: total,
            customerEmail: "",
          },
        }),
      }
    );

    const data = await orderRes.json();
    const checkoutUrl = data?.data?.checkoutLink;

    return NextResponse.json({ checkoutUrl, reference: data?.data?.orderReference });
  } catch (e) {
    return NextResponse.json(
      { error: "Checkout failed", detail: String(e) },
      { status: 500 }
    );
  }
}
