import React, { Component } from "react";
import { Text, Alert } from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import * as Animatable from "react-native-animatable";
import * as MailComposer from "expo-mail-composer";

class ContactUs extends Component {
	constructor(props) {
		super(props);
	}

	static navigationOptions = {
		title: "ContactUs",
	};
	sendMail() {
		if (MailComposer.isAvailableAsync()) {
			MailComposer.composeAsync({
				recipients: ["confusion@food.net"],
				subject: "Enquiry",
				body: "To whom it may concern:",
			});
		} else {
			Alert.alert(
				"ERROR",
				"NO DEFAULT EMAIL APP",
				[
					{
						text: "Cancel",
						style: "cancel",
					},
					{
						text: "OK",
					},
				],
				{ cancelable: false }
			);
		}
	}

	render() {
		return (
			<Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
				<Card>
					<Card.Title>Contact Information</Card.Title>
					<Text style={{ margin: 10 }}>
						121, Clear Water Bay Road {"\n"}Clear Water Bay, Kowloon
						{"\n"}HONG KONG {"\n"}Tel: +852 1234 5678 {"\n"}Fax: +852 8765 4321 {"\n"}
						Email:confusion@food.net
					</Text>
					<Button
						title="Send Email"
						buttonStyle={{ backgroundColor: "#512DA8" }}
						icon={<Icon name="envelope-o" type="font-awesome" color="white" />}
						onPress={this.sendMail}
					/>
				</Card>
			</Animatable.View>
		);
	}
}
export default ContactUs;
