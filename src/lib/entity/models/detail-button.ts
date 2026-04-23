export interface DetailButton {
  label: string;
  icon?: React.ComponentType<any>;
  size?: string;
  type?: "primary" | "danger";
  class?: any;
  key: string;
  isLoading: boolean;
}
