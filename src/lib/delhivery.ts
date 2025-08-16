
const DELHIVERY_API_BASE = 'https://track.delhivery.com';
const API_TOKEN = process.env.DELHIVERY_API_TOKEN;

async function fetchDelhiveryAPI(endpoint: string, options: RequestInit = {}) {
    if (!API_TOKEN) {
        console.error("Delhivery API Token is not configured.");
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

        // Handle cases where Delhivery returns non-JSON error pages (like 404s)
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
             const errorBody = await response.text();
             console.error(`Delhivery API Error: ${response.status} ${response.statusText}`, errorBody);
             const errorMessage = `Delhivery API request failed: ${response.statusText}. Please check API token and configuration.`;
             return { success: false, error: errorMessage, packages: [] };
        }

        const data = await response.json();
        
        // Ensure consistent success property based on API response structure
        if (data.success === false) {
             console.error(`Delhivery API returned a failure response:`, data);
             return { success: false, error: data.error || 'Unknown Delhivery API error.', packages: [] };
        }

        return { success: true, ...data };

    } catch (error) {
        console.error('Fetch to Delhivery API failed:', error);
        return { success: false, error: 'Network error or failed to fetch from Delhivery API.', packages: [] };
    }
}

/**
 * Checks if a pincode is serviceable.
 * @param pincode - The pincode to check.
 * @returns A promise that resolves with the serviceability data.
 */
export const checkPincodeServiceability = (pincode: string) => {
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

    // The response object is now guaranteed to have a `success` property
    // and a `packages` property (even if empty) on failure.
    if (!response.success) {
        console.error("Failed to create shipment due to API error:", response.error);
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
