import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "./Modal";
import { isIphoneX } from "./utils";

export const BORDER_RADIUS = 13;
export const BUTTON_FONT_WEIGHT = "normal";
export const BUTTON_FONT_SIZE = 20;
export const TITLE_FONT_SIZE = 20;

export class DateTimePickerModal extends React.PureComponent {
  static propTypes = {
    cancelTextIOS: PropTypes.string,
    confirmTextIOS: PropTypes.string,
    customCancelButtonIOS: PropTypes.elementType,
    customConfirmButtonIOS: PropTypes.elementType,
    customHeaderIOS: PropTypes.elementType,
    customPickerIOS: PropTypes.elementType,
    date: PropTypes.instanceOf(Date),
    headerTextIOS: PropTypes.string,
    modalPropsIOS: PropTypes.any,
    modalStyleIOS: PropTypes.any,
    isVisible: PropTypes.bool,
    pickerContainerStyleIOS: PropTypes.any,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    onHide: PropTypes.func,
    maximumDate: PropTypes.instanceOf(Date),
    minimumDate: PropTypes.instanceOf(Date),
    backgroundColor: PropTypes.string,
    titleColor: PropTypes.string,
    borderColor: PropTypes.string,
    buttonTextColor: PropTypes.string,
  };

  static defaultProps = {
    cancelTextIOS: "Cancel",
    confirmTextIOS: "Confirm",
    headerTextIOS: "Pick a date",
    modalPropsIOS: {},
    date: new Date(),
    isVisible: false,
    pickerContainerStyleIOS: {},
    backgroundColor: "white",
    titleColor: "#8f8f8f",
    borderColor: "#d5d5d5",
    buttonTextColor: "#007ff9",
  };

  state = {
    currentDate: this.props.date,
    isPickerVisible: this.props.isVisible,
  };

  didPressConfirm = false;

  static getDerivedStateFromProps(props, state) {
    if (props.isVisible && !state.isPickerVisible) {
      return { currentDate: props.date, isPickerVisible: true };
    }
    return null;
  }

  handleCancel = () => {
    this.didPressConfirm = false;
    this.props.onCancel();
  };

  handleConfirm = () => {
    this.didPressConfirm = true;
    this.props.onConfirm(this.state.currentDate);
  };

  handleHide = () => {
    const { onHide } = this.props;
    if (onHide) {
      onHide(this.didPressConfirm, this.state.currentDate);
    }
    this.setState({ isPickerVisible: false });
  };

  handleChange = (event, date) => {
    if (this.props.onChange) {
      this.props.onChange(date);
    }
    this.setState({ currentDate: date });
  };

  render() {
    const {
      cancelTextIOS,
      confirmTextIOS,
      customCancelButtonIOS,
      customConfirmButtonIOS,
      customHeaderIOS,
      customPickerIOS,
      date,
      headerTextIOS,
      isVisible,
      modalStyleIOS,
      modalPropsIOS,
      pickerContainerStyleIOS,
      onCancel,
      onConfirm,
      onChange,
      onHide,
      backgroundColor,
      titleColor,
      borderColor,
      buttonTextColor,
      ...otherProps
    } = this.props;

    const ConfirmButtonComponent = customConfirmButtonIOS || ConfirmButton;
    const CancelButtonComponent = customCancelButtonIOS || CancelButton;
    const HeaderComponent = customHeaderIOS || Header;
    const PickerComponent = customPickerIOS || DateTimePicker;

    return (
      <Modal
        isVisible={isVisible}
        contentStyle={[pickerStyles.modal, modalStyleIOS]}
        onBackdropPress={this.handleCancel}
        onHide={this.handleHide}
        {...modalPropsIOS}
      >
        <View
          style={[
            pickerStyles.container,
            { backgroundColor },
            pickerContainerStyleIOS,
          ]}
        >
          <HeaderComponent
            label={headerTextIOS}
            titleColor={titleColor}
            borderColor={borderColor}
          />
          <PickerComponent
            {...otherProps}
            value={this.state.currentDate}
            onChange={this.handleChange}
          />
          <ConfirmButtonComponent
            onPress={this.handleConfirm}
            label={confirmTextIOS}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
            buttonTextColor={buttonTextColor}
          />
        </View>
        <CancelButtonComponent
          onPress={this.handleCancel}
          label={cancelTextIOS}
          borderColor={borderColor}
          backgroundColor={backgroundColor}
          buttonTextColor={buttonTextColor}
        />
      </Modal>
    );
  }
}

const pickerStyles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 10,
  },
  container: {
    borderRadius: BORDER_RADIUS,
    marginBottom: 8,
    overflow: "hidden",
  },
});

export const Header = ({
  label,
  style = headerStyles,
  titleColor,
  borderColor,
}) => {
  return (
    <View style={[style.root, { borderColor }]}>
      <Text style={[style.text, { color: titleColor }]}>{label}</Text>
    </View>
  );
};

export const headerStyles = StyleSheet.create({
  root: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 14,
    backgroundColor: "transparent",
  },
  text: {
    textAlign: "center",
    fontSize: TITLE_FONT_SIZE,
  },
});

export const ConfirmButton = ({
  onPress,
  label,
  borderColor,
  backgroundColor,
  buttonTextColor,
  style = confirmButtonStyles,
}) => {
  return (
    <TouchableHighlight
      style={[style.button, { borderColor, backgroundColor }]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[style.text, { color: buttonTextColor }]}>{label}</Text>
    </TouchableHighlight>
  );
};

export const confirmButtonStyles = StyleSheet.create({
  button: {
    borderTopWidth: StyleSheet.hairlineWidth,
    backgroundColor: "transparent",
    height: 57,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    fontSize: BUTTON_FONT_SIZE,
    fontWeight: BUTTON_FONT_WEIGHT,
    backgroundColor: "transparent",
  },
});

export const CancelButton = ({
  backgroundColor,
  onPress,
  label,
  borderColor,
  buttonTextColor,
  style = cancelButtonStyles,
}) => {
  return (
    <TouchableHighlight
      style={[style.button, { backgroundColor, borderColor }]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[style.text, { color: buttonTextColor }]}>{label}</Text>
    </TouchableHighlight>
  );
};

export const cancelButtonStyles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS,
    height: 57,
    marginBottom: isIphoneX() ? 20 : 0,
    justifyContent: "center",
    backgroundColor: "white",
  },
  text: {
    padding: 10,
    textAlign: "center",
    fontSize: BUTTON_FONT_SIZE,
    fontWeight: "600",
    backgroundColor: "transparent",
  },
});
