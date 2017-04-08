import React, { PropTypes, Component } from 'react';
import CopyIcon from 'react-icons/lib/fa/copy';
import EyeIcon from 'react-icons/lib/fa/eye';
import EyeSlashIcon from 'react-icons/lib/fa/eye-slash';
import { Button } from 'buttercup-ui';
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
        click: () => this.handleReveal()
      });
    }

    showContextMenu(items);
  }

  handleReveal() {
    this.setState({concealed: !this.state.concealed});
  }

  handleCopy() {
    copyToClipboard(this.props.children);
  }

  renderPassword(content) {
    return (<span role="content">{this.state.concealed ? '●'.repeat(10) : content}</span>);
  }

  render() {
    const { children, type } = this.props;
    if (!children) {
      return null;
    }
    
    return (
      <div className={styles.wrapper} onContextMenu={() => this.showContextMenu()}>
        <div className={styles.content} role="content">
          {type === 'password' ? this.renderPassword(children) : children}
        </div>
        <div className={styles.buttons}>
          {(type || '').toLowerCase() === 'password' &&
            <Button
              icon={this.state.concealed ? <EyeIcon/> : <EyeSlashIcon/>}
              title={this.state.concealed ? 'Reveal' : 'Hide'}
              className={styles.button}
              onClick={() => this.handleReveal()}
              />}
          <Button
            icon={<CopyIcon/>}
            title="Copy"
            className={styles.button}
            onClick={() => this.handleCopy()}
            />
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
