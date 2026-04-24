export type SpeedBucket = "painful" | "okay" | "lekker" | "fast" | "ferrari";

export interface BucketInfo {
  bucket: SpeedBucket;
  label: string;
  description: string;
}

export function bucketFor(downloadMbps: number): BucketInfo {
  if (downloadMbps < 5)
    return {
      bucket: "painful",
      label: "Ouch",
      description: "Dial-up vibes. WhatsApp voice notes only.",
    };
  if (downloadMbps < 25)
    return {
      bucket: "okay",
      label: "Okay",
      description: "Fine for one HD stream. Don't push it.",
    };
  if (downloadMbps < 100)
    return {
      bucket: "lekker",
      label: "Lekker",
      description: "Solid home internet. Braai-ready.",
    };
  if (downloadMbps < 500)
    return {
      bucket: "fast",
      label: "Vinnig",
      description: "Fibre doing what fibre should.",
    };
  return {
    bucket: "ferrari",
    label: "Ferrari",
    description: "You are showing off now.",
  };
}