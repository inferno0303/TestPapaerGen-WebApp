import React from 'react';
import { connect } from 'umi';
import HomeTemplate from './homeTemplate/index';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    return <div>
      <HomeTemplate />
    </div>;
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(Home);
