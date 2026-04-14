export type HealthResponse = {
  status: "ok";
};

export type ApiErrorResponse = {
  error: string;
};

export type DemoMessageResponse = {
  message: string;
  timestamp: string;
};

export type DemoItem = {
  id: string;
  label: string;
};

export type DemoItemsResponse = {
  items: DemoItem[];
};

export type DemoEchoRequest = {
  text: string;
};

export type DemoEchoResponse = {
  received: string;
  timestamp: string;
};
