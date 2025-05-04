import { FUNCTIONS_URL } from "@/constants/api";

/**
 * Converts an object URL to a File object
 */
export async function objectUrlToFile(
  objectUrl: string,
  filename: string = "image.png"
): Promise<File> {
  // Fetch the blob from the object URL
  const response = await fetch(objectUrl);
  const blob = await response.blob();

  // Create a new File object from the blob
  return new File([blob], filename, { type: blob.type });
}

export interface GenerateAdResponse {
  success: boolean;
  imageUrls?: string[];
  id?: string;
  error?: string;
}

export async function generateAdCreative(
  images: string[],
  prompt: string,
  transactionId: string,
  userEmail: string,
  options?: {
    size?: string;
    templateName?: string;
    selectedIntent?: string | null;
  }
): Promise<GenerateAdResponse> {
  try {
    const formData = new FormData();

    // Handle different types of image inputs
    await Promise.all(
      images.map(async (image, index) => {
        const file = await objectUrlToFile(image, `image-${index}.png`);
        formData.append("images", file);
      })
    );

    // Add other required fields
    formData.append("prompt", prompt);
    formData.append("transactionId", transactionId);
    formData.append("userEmail", userEmail);
    if (options?.size) formData.append("size", options.size);
    if (options?.templateName)
      formData.append("templateName", options.templateName);
    if (options?.selectedIntent)
      formData.append("selectedIntent", options.selectedIntent);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("mock_images"); // encoded string
      const urls = raw ? decodeURIComponent(raw).split(",") : [];

      if (urls.length > 0) {
        urls.forEach((url) => {
          formData.append("mock_images", url);
        });
      }
    }

    const response = await fetch(`${FUNCTIONS_URL}/generate-gpt-images`, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(300000),
    });

    if (!response.ok) {
      // Clone the response and parse the JSON to get the error message
      const errorData = await response
        .clone()
        .json()
        .catch(() => null);
      console.error("API error response:", errorData);

      // Use the error message from the API if available
      if (errorData && errorData.error) {
        throw new Error(errorData.error);
      } else if (errorData && errorData.details) {
        throw new Error(errorData.details);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if response contains images array
    if (data.success && data.images && data.images.length > 0) {
      return {
        success: true,
        imageUrls: data.images,
        id: data.id || null,
      };
    } else {
      // Handle successful response but no images
      throw new Error(data.error || "No images were generated");
    }
  } catch (error) {
    console.error("Error generating ad creative:", error);

    // Log specific timeout error
    if (error instanceof Error && error.name === "AbortError") {
      console.error("API request timed out after 5 minutes");
    }

    // Extract detailed error message if available
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "object" &&
          error &&
          "details" in error &&
          typeof error.details === "string"
        ? error.details
        : "Unknown error occurred";

    return {
      success: false,
      error: errorMessage,
    };
  }
}
