export type UpgradeSubscriptionServiceResponse = {
  data: {
    url: string;
  };
};

export type UpgradeSubscriptionServiceBody = {
  plan: "pro" | "elite";
};

export type GetSubscriptionServiceResponse = {
  data: {
    plan: "pro" | "elite";
  };
};
