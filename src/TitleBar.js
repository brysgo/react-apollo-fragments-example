import React from "react";
import { View, Text } from "react-native";
import { Fragment } from "react-apollo-fragments";
import gql from "graphql-tag";

export default (TitleBar = ({ style, data: { title } }) => (
  <Fragment fragment={TitleBar.fragments.data}>
    {() => (
      <View
        style={{ ...style, backgroundColor: "black", alignItems: "center" }}
      >
        <Text style={{ color: "white" }}>{title}</Text>
      </View>
    )}
  </Fragment>
));
TitleBar.fragments = {
  data: gql`
    fragment TitleBar on TreeDocument {
      title
    }
  `
};
