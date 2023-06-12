export default function inputStyle() {
  const labelStyle = (errors: any[], disabled: boolean): string => {
    if (errors.length > 0) {
      return 'red--text';
    } else if (disabled) {
      return 'disabled-label-input';
    } else {
      return 'black--text';
    }
  };

  const starStyle = (disabled: boolean): string => {
    return disabled ? 'disabled-label-input' : 'red--text';
  };

  return {
    labelStyle,
    starStyle
  };
}
