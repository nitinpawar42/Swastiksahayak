
const DELHIVERY_API_BASE = 'https://track.delhivery.com';
const API_TOKEN = process.env.DELHIVERY_API_TOKEN;

async function fetchDelhiveryAPI(endpoint: string, options: RequestInit = {}) {
    if (!API_TOKEN) {
        console.error("Delhivery API Token is not configured.");
        // In a real app, you might want to throw an error or handle this case more gracefully
        // For now, we'll return a mock error to avoid crashing the server on startup.
        return { success: false, error: "API token not configured." };
    }
    const url = `${DELHIVERY_API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_TOKEN}`,
        ...options.headers,
    };

    try {
        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Delhivery API Error: ${response.status} ${response.statusText}`, errorBody);
            // Return a structured error instead of throwing
            return { success: false, error: `Delhivery API request failed: ${response.statusText}` };
        }

        const data = await response.json();
        return { success: true, ...data };

    } catch (error) {
        console.error('Fetch to Delhivery API failed:', error);
        return { success: false, error: 'Network error or failed to fetch from Delhivery API.' };
    }
}

/**
 * Checks if a pincode is serviceable.
 * @param pincode - The pincode to check.
 * @returns A promise that resolves with the serviceability data.
 */
export const checkPincodeServiceability = (pincode: string) => {
    // The endpoint here was incorrect. Correcting it to the right one.
    return fetchDelhiveryAPI(`/api/kinko/v1/invoice/charges/json/?md=S&ss=DTO&d_pin=${pincode}`);
};


/**
 * Creates a new shipment.
 * @param shipmentData - The data for the shipment to be created.
 * @returns A promise that resolves with the created shipment data.
 */
export const createShipment = async (shipmentData: any) => {
    
    const response = await fetchDelhiveryAPI('/api/cmu/create.json', {
        method: 'POST',
        body: `format=json&data=${encodeURIComponent(JSON.stringify(shipmentData))}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    // Handle API call failure before proceeding
    if (!response.success) {
        console.error("Failed to create shipment due to API error:", response.error);
        // Propagate a clear error structure
        return { success: false, packages: [], error: response.error };
    }

    return response;
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
