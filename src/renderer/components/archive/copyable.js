import React, { PropTypes, Component } from 'react';
import { showContextMenu } from '../../system/menu';
import { copyToClipboard } from '../../system/utils';
import styles from '../../styles/copyable';

class Copyable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      concealed: true
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.children !== this.props.children) {
      this.setState({concealed: true});
    }
  }

  showContextMenu() {
    const { type } = this.props;
    const items = [
      {
        label: 'Copy to Clipboard',
        click: () => this.handleCopy()
      }
    ];

    if ((type || '').toLowerCase() === 'password') {
      items.push({
        label: 'Reveal Password',
        type: 'checkbox',
        checked: !this.state.concealed,
        click: () => {
          this.setState({concealed: !this.state.concealed});
        }
      });
    }

    showContextMenu(items);
  }

  handleCopy() {
    copyToClipboard(this.props.children);
  }

  renderPassword(content) {
    return (<span>{this.state.concealed ? '●'.repeat(content.length) : content}</span>);
  }

  render() {
    const { children, type } = this.props;
    if (!children) {
      return null;
    }
    
    return (
      <div className={styles.wrapper} onContextMenu={() => this.showContextMenu()}>
        <div className={styles.content}>
          <span>{type === 'password' ? this.renderPassword(children) : children}</span>
          <button className={styles.button} onClick={() => this.handleCopy()}>Copy</button>
        </div>
      </div>
    );
  }
}

Copyable.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string
};

export default Copyable;
