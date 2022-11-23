/* Direct messages */

import { lg_api } from "../../__modules__";
import React from "react";

class Dm extends React.Component {
  constructor() {
    super();
    this.state = { messages: [], mesagge: "" };
  }

  componentDidMount() {
    lg_api("direct-messages/direct-message/", {
      headers: {},
    });
  }
}
