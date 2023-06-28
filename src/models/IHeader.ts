export default interface IHeader {
  text: string;
  align: string;
  sortable: boolean;
  value: string;
  filter?: (value: any, search: string, item: any) => boolean;
}
