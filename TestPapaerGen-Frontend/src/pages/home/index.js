import React from 'react';
import { connect } from 'umi';
import HomeTemplate from './homeTemplate/index';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }


  // lifeCycle
  componentDidMount() {

  }

  render() {
    return <div>
      <HomeTemplate/>
    </div>;
  }
}

function mapStateToProps(state) {
  console.log(state.global);
  return {};
}

export default connect(mapStateToProps)(Home);
