/*
 * JS
 */
import BoxRefresh from './src/BoxRefresh';
import BoxWidget from './src/BoxWidget';
import ControlSidebar from './src/ControlSidebar';
import DirectChat from './src/DirectChat';
import Layout from './src/Layout';
import PushMenu from './src/PushMenu';
import TodoList from './src/TodoList';
import Tree from './src/Tree';

// Bind All
const binder = () => {
  BoxRefresh.bind();
  BoxWidget.bind();
  ControlSidebar.bind();
  DirectChat.bind();
  Layout.bind();
  PushMenu.bind();
  TodoList.bind();
  Tree.bind();
};

window.BoxRefresh = BoxRefresh;
window.BoxWidget = BoxWidget;
window.ControlSidebar = ControlSidebar;
window.DirectChat = DirectChat;
window.Layout = Layout;
window.PushMenu = PushMenu;
window.TodoList = TodoList;
window.Tree = Tree;

document.addEventListener('DOMContentLoaded', binder);
