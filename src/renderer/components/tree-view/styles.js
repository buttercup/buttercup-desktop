import { createGlobalStyle } from 'styled-components';
import TrashFull from '../../styles/img/trash-full.svg';
import TrashEmpty from '../../styles/img/trash-empty.svg';
import FolderOpen from '../../styles/img/folder-open.svg';
import FolderClosed from '../../styles/img/folder.svg';

export default createGlobalStyle`
  .rc-tree {
    margin: 0;
    padding: 0;
    -webkit-app-region: no-drag;
    
    li {
      padding: 0;
      margin: 0;
      list-style: none;
      white-space: nowrap;
      outline: 0;

      .draggable {
        user-select: none;
      }

      &.drag-over {
        > .draggable {
          background-color: #316ac5;
          color: white;
          border: 1px #316ac5 solid;
          opacity: 0.8;
        }
      }

      &.drag-over-gap-top {
        > .draggable {
          border-top: 5px var(--brand-primary) solid;
        }
      }

      &.drag-over-gap-bottom {
        > .draggable {
          border-bottom: 5px var(--brand-primary) solid;
        }
      }

      &.filter-node {
        > .rc-tree-node-content-wrapper {
          color: #a60000 !important;
          font-weight: bold !important;
        }
      }

      ul {
        margin: 0;
        padding: 0 0 0 18px;
      }

      .rc-tree-node-content-wrapper {
        margin: 0;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        width: calc(100% - 18px);
        font-size: .9em;
      }

      span {
        &.rc-tree-switcher,
        &.rc-tree-iconEle {
          background-size: 16px 16px;
          line-height: 16px;
          margin-right: 2px;
          width: 16px;
          height: 16px;
          display: inline-block;
          vertical-align: middle;
          border: 0 none;
          cursor: pointer;
          outline: none;
          background-repeat: no-repeat;
        }

        &.rc-tree-switcher {
          position: relative;

          &:before {
            content: "";
            border: 4px solid transparent;
            border-left-color: #fff;
            position: absolute;
            top: 4px;
            left: 10px;
          }

          &.rc-tree-switcher-noop {
            cursor: auto;
          }
          &.rc-tree-switcher_open {
            &:before {
              transform: rotate(45deg);
              transform-origin: 0;
            }
          }
          &.rc-tree-switcher_close { }
        }
      }

      &.is-trash {
        > .rc-tree-node-content-wrapper > span.rc-tree-iconEle {
          background-image: url(${TrashFull}) !important;
        }

        &.is-empty {
          > .rc-tree-node-content-wrapper > span.rc-tree-iconEle {
            background-image: url(${TrashEmpty}) !important;
          }
        }
      }

      &.is-empty {
        .rc-tree-switcher {
          opacity: 0;
        }
      }
    }

    &-title {
      display: inline-block;
      width: calc(100% - 18px);
      vertical-align: middle;
    }

    &-child-tree {
      display: none;
      &-open {
        display: block;
      }
    }
    &-treenode-disabled {
      >span,
      >a,
      >a span {
        color: #ccc;
        cursor: not-allowed;
      }
    }
    &-node-selected {
      color: #00B7AC
    }
    &-icon__open {
      background-image: url(${FolderOpen}) !important;
    }
    &-icon__close {
      background-image: url(${FolderClosed}) !important;
    }
  }
`;
