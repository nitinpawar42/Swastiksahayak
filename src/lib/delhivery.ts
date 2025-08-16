const DELHIVERY_API_BASE = 'https://track.delhivery.com';
const API_TOKEN = process.env.DELHIVERY_API_TOKEN;

async function fetchDelhiveryAPI(endpoint: string, options: RequestInit = {}) {
    if (!API_TOKEN) {
        console.error("Delhivery API Token is not configured.");
        // In a real app, you might want to throw an error or handle this case more gracefully
        // For now, we'll return a mock error to avoid crashing the server on startup.
        return { error: "API token not configured." };
    }
    const url = `${DELHIVERY_API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Delhivery API Error: ${response.status} ${response.statusText}`, errorBody);
        throw new Error(`Delhivery API request failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Checks if a pincode is serviceable.
 * @param pincode - The pincode to check.
 * @returns A promise that resolves with the serviceability data.
 */
export const checkPincodeServiceability = (pincode: string) => {
    return fetchDelhiveryAPI(`/c/api/pin-codes/json/?filter_codes=${pincode}`);
};

/**
 * Creates a new shipment.
 * @param shipmentData - The data for the shipment to be created.
 * @returns A promise that resolves with the created shipment data.
 */
export const createShipment = (shipmentData: any) => {
    // Removing cod_amount from the payload as requested
    const { cod_amount, ...shipmentDataWithoutCod } = shipmentData;
    
    return fetchDelhiveryAPI('/api/cmu/create.json', {
        method: 'POST',
        body: `format=json&data=${encodeURIComponent(JSON.stringify(shipmentDataWithoutCod))}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

/**
 * Tracks a shipment by waybill number.
 * @param waybill - The waybill number of the shipment to track.
 * @returns A promise that resolves with the tracking information.
 */
export const trackShipment = (waybill: string) => {
    return fetchDelhiveryAPI(`/api/v1/packages/json/?waybill=${waybill}`);
};

/**
 * Cancels a shipment.
 * @param waybill - The waybill number of the shipment to cancel.
 * @returns A promise that resolves with the cancellation status.
 */
export const cancelShipment = (waybill: string) => {
    const payload = {
        waybill,
        cancellation: 'true',
    };
    return fetchDelhiveryAPI('/api/p/edit', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
};
