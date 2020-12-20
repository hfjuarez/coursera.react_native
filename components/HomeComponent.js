import React, { Component } from "react";
import { Text, ScrollView, View } from "react-native";
import { Card } from "react-native-elements";
import { DISHES } from "../shared/dishes";
import { PROMOTIONS } from "../shared/promotions";
import { LEADERS } from "../shared/leaders";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { ActivityIndicator } from "react-native";
import { Image } from "react-native-elements";
const mapStateToProps = (state) => {
	return {
		dishes: state.dishes,
		comments: state.comments,
		promotions: state.promotions,
		leaders: state.leaders,
	};
};

function RenderItem(props) {
	const item = props.item;
	if (item != null) {
		return (
			<Card>
				<Card.Title>{item.name}</Card.Title>
				<Card.Divider />
				<Image
					source={{ uri: baseUrl + item.image }}
					style={{ width: 200, height: 200 }}
					PlaceholderContent={<ActivityIndicator />}
				/>
				<Text style={{ margin: 10 }}>{item.description}</Text>
			</Card>
		);
	} else {
		return <View></View>;
	}
}

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dishes: DISHES,
			promotions: PROMOTIONS,
			leaders: LEADERS,
		};
	}

	static navigationOptions = {
		title: "Home",
	};

	render() {
		return (
			<ScrollView>
				<RenderItem item={this.props.dishes.dishes.filter((dish) => dish.featured)[0]} />
				<RenderItem
					item={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
				/>
				<RenderItem
					item={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
				/>
			</ScrollView>
		);
	}
}

export default connect(mapStateToProps)(Home);
