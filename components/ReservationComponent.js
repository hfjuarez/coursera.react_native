import React, { Component, useState, useEffect, useRef } from "react";
import {
	Text,
	View,
	ScrollView,
	StyleSheet,
	Picker,
	Switch,
	Button,
	Modal,
	Alert,
} from "react-native";
import { Card } from "react-native-elements";
import DatePicker from "react-native-datepicker";
import * as Animatable from "react-native-animatable";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as Calendar from "expo-calendar";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

class Reservation extends Component {
	constructor(props) {
		super(props);

		this.state = {
			guests: 1,
			smoking: false,
			date: "",
			showModal: false,
		};
	}

	static navigationOptions = {
		title: "Reserve Table",
	};

	handleReservation() {
		// console.log(JSON.stringify(this.state));
		// this.toggleModal();
		Alert.alert(
			"Add Favorite",
			"Number of Guests: " +
				this.state.guests +
				"\n" +
				"Somoking: " +
				this.state.smoking +
				"\n" +
				"Date and Time: " +
				this.state.date,
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel",
				},
				{
					text: "OK",
					onPress: () => {
						this.addReservationToCalendar(this.state.date);
						this.schedulePushNotification(this.state.date);

						this.resetForm();
						// this.presentLocalNotification(this.state.date);
					},
				},
			],
			{ cancelable: false }
		);
	}

	resetForm() {
		this.setState({
			guests: 1,
			smoking: false,
			date: "",
			showModal: false,
		});
	}

	async addReservationToCalendar(date) {
		const { status } = await Calendar.requestCalendarPermissionsAsync();
		const { status2 } = await Calendar.requestRemindersPermissionsAsync();
		const ddate = new Date(date);
		const startDate = new Date(
			ddate.getYear(),
			ddate.getMonth(),
			ddate.getDay(),
			ddate.getHours() + 1,
			ddate.getMinutes(),
			ddate.getSeconds(),
			ddate.getMilliseconds()
		);
		const endDate = new Date(
			ddate.getYear(),
			ddate.getMonth(),
			ddate.getDay(),
			ddate.getHours() + 2,
			ddate.getMinutes(),
			ddate.getSeconds(),
			ddate.getMilliseconds()
		);
		// if (status == "granted" && status2 == "granted") {
		const calendars = await Calendar.getCalendarsAsync();
		const defaultCalendarSource = calendars[0];

		const id = Calendar.createEventAsync(defaultCalendarSource.id, {
			title: "Con Fusion Table Reservation",
			startDate: startDate,
			endDate: endDate,
			location: "121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong",
		});
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "DATA",
				body: "id: " + id + " " + "startDate: " + startDate + " " + "endDate: " + endDate,
				ios: {
					sound: true,
				},
				android: {
					sound: true,
					vibrate: true,
					color: "#512DA8",
				},
			},
			trigger: { seconds: 2 },
		});
		// }
	}

	async schedulePushNotification(date) {
		await this.obtainNotificationPermission();
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "Your Reservation",
				body: "Reservation for " + date + " requested",
				ios: {
					sound: true,
				},
				android: {
					sound: true,
					vibrate: true,
					color: "#512DA8",
				},
			},
			trigger: { seconds: 2 },
		});
	}

	async obtainNotificationPermission() {
		let token;
		if (Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(
				Permissions.NOTIFICATIONS
			);
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				alert("Failed to get push token for push notification!");
				return;
			}
			token = (await Notifications.getExpoPushTokenAsync()).data;
			console.log(token);
		} else {
			alert("Must use physical device for Push Notifications");
		}

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		// return permission;
	}

	async presentLocalNotification(date) {
		await this.obtainNotificationPermission();
		Notifications.scheduleLocalNotificationAsync({
			content: {
				title: "Your Reservation",
				body: "Reservation for " + date + " requested",
				ios: {
					sound: true,
					_displayInForeground: true,
				},
				android: {
					sound: true,
					vibrate: true,
					color: "#512DA8",
				},
			},

			trigger: { seconds: 2 },
		});
	}

	render() {
		return (
			<ScrollView>
				<Animatable.View animation="zoomIn" duration={2000} delay={1000}>
					<View style={styles.formRow}>
						<Text style={styles.formLabel}>Number of Guests</Text>
						<Picker
							style={styles.formItem}
							selectedValue={this.state.guests}
							onValueChange={(itemValue, itemIndex) =>
								this.setState({ guests: itemValue })
							}
						>
							<Picker.Item label="1" value="1" />
							<Picker.Item label="2" value="2" />
							<Picker.Item label="3" value="3" />
							<Picker.Item label="4" value="4" />
							<Picker.Item label="5" value="5" />
							<Picker.Item label="6" value="6" />
						</Picker>
					</View>
					<View style={styles.formRow}>
						<Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
						<Switch
							style={styles.formItem}
							value={this.state.smoking}
							onTintColor="#512DA8"
							onValueChange={(value) => this.setState({ smoking: value })}
						></Switch>
					</View>
					<View style={styles.formRow}>
						<Text style={styles.formLabel}>Date and Time</Text>
						<DatePicker
							style={{ flex: 2, marginRight: 20 }}
							date={this.state.date}
							format=""
							mode="datetime"
							placeholder="select date and Time"
							minDate="2017-01-01"
							confirmBtnText="Confirm"
							cancelBtnText="Cancel"
							customStyles={{
								dateIcon: {
									position: "absolute",
									left: 0,
									top: 4,
									marginLeft: 0,
								},
								dateInput: {
									marginLeft: 36,
								},
								// ... You can check the source to find the other keys.
							}}
							onDateChange={(date) => {
								this.setState({ date: date });
							}}
						/>
					</View>
					<View style={styles.formRow}>
						<Button
							onPress={() => this.handleReservation()}
							title="Reserve"
							color="#512DA8"
							accessibilityLabel="Learn more about this purple button"
						/>
					</View>
					<Modal
						animationType={"slide"}
						transparent={false}
						visible={this.state.showModal}
						onDismiss={() => this.toggleModal()}
						onRequestClose={() => this.toggleModal()}
					>
						<View style={styles.modal}>
							<Text style={styles.modalTitle}>Your Reservation</Text>
							<Text style={styles.modalText}>
								Number of Guests: {this.state.guests}
							</Text>
							<Text style={styles.modalText}>
								Smoking?: {this.state.smoking ? "Yes" : "No"}
							</Text>
							<Text style={styles.modalText}>Date and Time: {this.state.date}</Text>

							<Button
								onPress={() => {
									this.resetForm();
								}}
								color="#512DA8"
								title="Close"
							/>
						</View>
					</Modal>
				</Animatable.View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	formRow: {
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		flexDirection: "row",
		margin: 20,
	},
	formLabel: {
		fontSize: 18,
		flex: 2,
	},
	formItem: {
		flex: 1,
	},
	modal: {
		justifyContent: "center",
		margin: 20,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "bold",
		backgroundColor: "#512DA8",
		textAlign: "center",
		color: "white",
		marginBottom: 20,
	},
	modalText: {
		fontSize: 18,
		margin: 10,
	},
});

export default Reservation;
