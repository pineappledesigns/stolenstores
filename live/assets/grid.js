/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 766:
/***/ (function(__unused_webpack_module, exports) {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = true;
var EventHandler = /** @class */ (function () {
    function EventHandler() {
        this.events = [];
    }
    EventHandler.prototype.register = function (el, event, listener) {
        if (!el || !event || !listener)
            return null;
        this.events.push({ el: el, event: event, listener: listener });
        el.addEventListener(event, listener);
        return { el: el, event: event, listener: listener };
    };
    EventHandler.prototype.unregister = function (_a) {
        var el = _a.el, event = _a.event, listener = _a.listener;
        if (!el || !event || !listener)
            return null;
        this.events = this.events.filter(function (e) { return el !== e.el
            || event !== e.event || listener !== e.listener; });
        el.removeEventListener(event, listener);
        return { el: el, event: event, listener: listener };
    };
    EventHandler.prototype.unregisterAll = function () {
        this.events.forEach(function (_a) {
            var el = _a.el, event = _a.event, listener = _a.listener;
            return el.removeEventListener(event, listener);
        });
        this.events = [];
    };
    return EventHandler;
}());
exports.Z = EventHandler;


/***/ }),

/***/ 263:
/***/ (function(module) {

"use strict";


// forEach method, could be shipped as part of an Object Literal/Module
function forEach(array, callback, scope) {
  var index = 0;

  for (index = 0; index < array.length; index += 1) {
    callback.call(scope, array[index], index); // passes back stuff we need
  }
}

function hasClass(el, className) {
  var regex = new RegExp('^' + className + '| +' + className, 'g');

  return el.className.match(regex);
}

function addClass(el, className) {
  // Return if it already has the className
  if (hasClass(el, className)) return;

  el.className += ' ' + className;
}

function removeClass(el, className) {
  // Return if it doesn't already have the className
  if (!hasClass(el, className)) return;

  var regex = new RegExp('^' + className + '| +' + className, 'g');

  el.className = el.className.replace(regex, '');
}

function toggleClass(el, className) {
  if (hasClass(el, className)) {
    removeClass(el, className);
  } else {
    addClass(el, className);
  }
}

function findPairingFromPairingTrigger(pairings, pairingTrigger) {
  var foundPairing = null;

  forEach(pairings, function (pairing) {
    if (pairing.trigger === pairingTrigger) {
      foundPairing = pairing;
    }
  });

  return foundPairing;
}

/**
 * See {@link https://stackoverflow.com/revisions/2117523/11 Stack Overflow}
 * An RFC4122 v4 compliant uuid solution
 */
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : r & 0x3 | 0x8;

    return v.toString(16);
  });
}

function init(groupedContent) {
  var triggers = groupedContent.triggers;
  var pairings = groupedContent.pairings;

  triggers.setAttribute('role', 'tablist');

  forEach(pairings, function (pairing, index) {
    pairing.trigger.setAttribute('role', 'tab');
    pairing.trigger.setAttribute('aria-controls', groupedContent.namespace + '-' + groupedContent.id + '-' + index + '-content');

    var triggerContent = pairing.trigger.innerHTML;
    var triggerWrapper = document.createElement('span');
    triggerWrapper.innerHTML = triggerContent;

    pairing.trigger.innerHTML = '';
    pairing.trigger.appendChild(triggerWrapper);

    if (pairing.trigger.children.length > 0) {
      forEach(pairing.trigger.children, function (child) {
        child.setAttribute('tabIndex', '-1');
      });
    }

    if (hasClass(pairing.trigger, 'active')) {
      pairing.trigger.setAttribute('aria-selected', 'true');
      pairing.trigger.setAttribute('tabIndex', '0');
    } else {
      pairing.trigger.setAttribute('tabIndex', '-1');
    }

    pairing.content.id = groupedContent.namespace + '-' + groupedContent.id + '-' + index + '-content';
    pairing.content.setAttribute('role', 'tabpanel');

    if (!hasClass(pairing.content, 'active')) {
      pairing.content.setAttribute('aria-hidden', 'true');
    }
  });
}

function update(groupedContent) {
  var pairings = groupedContent.pairings;

  forEach(pairings, function (pairing) {
    pairing.trigger.removeAttribute('aria-selected');
    pairing.content.removeAttribute('aria-hidden');

    if (hasClass(pairing.trigger, 'active')) {
      pairing.trigger.setAttribute('aria-selected', 'true');
      pairing.trigger.setAttribute('tabIndex', '0');
    } else {
      pairing.trigger.setAttribute('tabIndex', '-1');
    }

    if (!hasClass(pairing.content, 'active')) {
      pairing.content.setAttribute('aria-hidden', 'true');
    }
  });
}

var a11y = {
  init: init,
  update: update
};

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/** A class for creating, managing, and destroying groupable content as tabs. */

var TabsLayout = function () {
  function TabsLayout(groupedContent) {
    classCallCheck(this, TabsLayout);

    this.groupedContent = groupedContent;
    this.pairings = groupedContent.pairings;
    this.events = [];

    this._handleKeydown = this._handleKeydown.bind(this);
    this._handleClick = this._handleClick.bind(this);

    this._init();
    a11y.init(this.groupedContent);
  }

  createClass(TabsLayout, [{
    key: 'unload',
    value: function unload() {
      forEach(this.events, function (event) {
        event.trigger.removeEventListener(event.type, event.fn);
      });
    }
  }, {
    key: '_init',
    value: function _init() {
      var _this = this;

      var existingActive = false;

      forEach(this.pairings, function (pairing) {
        var trigger = pairing.trigger;

        if (hasClass(trigger, 'active')) {
          existingActive = true;
        }

        trigger.addEventListener('keydown', _this._handleKeydown);
        trigger.addEventListener('click', _this._handleClick);

        _this.events.push({
          trigger: trigger,
          type: 'keydown',
          fn: _this._handleKeydown
        });

        _this.events.push({
          trigger: trigger,
          type: 'click',
          fn: _this._handleClick
        });
      });

      if (!existingActive) {
        addClass(this.pairings[0].trigger, 'active');
        addClass(this.pairings[0].content, 'active');
      }
    }
  }, {
    key: '_handleKeydown',
    value: function _handleKeydown(event) {
      var trigger = event.currentTarget;
      var pairing = findPairingFromPairingTrigger(this.pairings, trigger);
      var pairingIndex = this.pairings.indexOf(pairing);
      var prevIndex = pairingIndex - 1 < 0 ? this.pairings.length - 1 : pairingIndex - 1;
      var nextIndex = pairingIndex + 1 >= this.pairings.length ? 0 : pairingIndex + 1;

      var nextPairing = null;

      switch (event.key) {
        case 'ArrowLeft':
          nextPairing = this.pairings[prevIndex];
          break;
        case 'ArrowRight':
          nextPairing = this.pairings[nextIndex];
          break;
        default:
          nextPairing = null;
          break;
      }

      // Fast exit if we can't find the tab or tabs
      if (nextPairing === null) return;

      event.preventDefault();

      forEach(this.pairings, function (inactivePairing) {
        removeClass(inactivePairing.trigger, 'active');
        removeClass(inactivePairing.content, 'active');
      });

      addClass(nextPairing.trigger, 'active');
      addClass(nextPairing.content, 'active');

      nextPairing.trigger.focus();

      a11y.update(this.groupedContent);
    }
  }, {
    key: '_handleClick',
    value: function _handleClick(event) {
      var trigger = event.currentTarget;
      var pairing = findPairingFromPairingTrigger(this.pairings, trigger);

      // Fast exit if we can't find the tab or tabs
      if (pairing === null) return;

      event.preventDefault();

      forEach(this.pairings, function (inactivePairing) {
        removeClass(inactivePairing.trigger, 'active');
        removeClass(inactivePairing.content, 'active');
      });

      addClass(pairing.trigger, 'active');
      addClass(pairing.content, 'active');

      a11y.update(this.groupedContent);
    }
  }]);
  return TabsLayout;
}();

function init$1(groupedContent) {
  var pairings = groupedContent.pairings;

  forEach(pairings, function (pairing, index) {
    pairing.trigger.setAttribute('role', 'button');
    pairing.trigger.setAttribute('aria-controls', groupedContent.namespace + '-' + groupedContent.id + '-' + index + '-content');
    pairing.trigger.setAttribute('tabIndex', '0');

    if (pairing.trigger.children.length > 0) {
      forEach(pairing.trigger.children, function (child) {
        child.setAttribute('tabIndex', '-1');
      });
    }

    if (hasClass(pairing.trigger, 'active')) {
      pairing.trigger.setAttribute('aria-expanded', 'true');
    } else {
      pairing.trigger.setAttribute('aria-expanded', 'false');
    }

    pairing.content.id = groupedContent.namespace + '-' + groupedContent.id + '-' + index + '-content';

    if (!hasClass(pairing.content, 'active')) {
      pairing.content.setAttribute('aria-hidden', 'true');
    }
  });
}

function update$1(groupedContent) {
  var pairings = groupedContent.pairings;

  forEach(pairings, function (pairing) {
    pairing.content.removeAttribute('aria-hidden');

    if (hasClass(pairing.trigger, 'active')) {
      pairing.trigger.setAttribute('aria-expanded', 'true');
    } else {
      pairing.trigger.setAttribute('aria-expanded', 'false');
    }

    if (!hasClass(pairing.content, 'active')) {
      pairing.content.setAttribute('aria-hidden', 'true');
    }
  });
}

var a11y$1 = {
  init: init$1,
  update: update$1
};

/** A class for creating, managing, and destroying groupable content as an accordion. */

var AccordionLayout = function () {
  function AccordionLayout(groupedContent) {
    classCallCheck(this, AccordionLayout);

    this.groupedContent = groupedContent;
    this.pairings = groupedContent.pairings;
    this.events = [];

    this._handleKeydown = this._handleKeydown.bind(this);
    this._handleClick = this._handleClick.bind(this);

    this._init(this.pairings);
    a11y$1.init(this.groupedContent);
  }

  createClass(AccordionLayout, [{
    key: 'unload',
    value: function unload() {
      forEach(this.events, function (event) {
        event.trigger.removeEventListener(event.type, event.fn);
      });
    }
  }, {
    key: '_init',
    value: function _init() {
      var _this = this;

      forEach(this.pairings, function (pairing) {
        var trigger = pairing.trigger;
        var content = pairing.content;

        trigger.parentNode.insertBefore(content, trigger.nextSibling);

        trigger.addEventListener('keydown', _this._handleKeydown);
        trigger.addEventListener('click', _this._handleClick);

        _this.events.push({
          trigger: trigger,
          type: 'keydown',
          fn: _this._handleKeydown
        });

        _this.events.push({
          trigger: trigger,
          type: 'click',
          fn: _this._handleClick
        });
      });

      this.groupedContent.contents.remove();
    }
  }, {
    key: '_handleKeydown',
    value: function _handleKeydown(event) {
      var trigger = event.currentTarget;
      var pairing = findPairingFromPairingTrigger(this.pairings, trigger);

      // Fast exit if enter isn't pressed or we can't find the group
      if (event.key !== 'Enter' || pairing === null) return;

      event.preventDefault();

      toggleClass(pairing.trigger, 'active');
      toggleClass(pairing.content, 'active');
      a11y$1.update(this.groupedContent);
    }
  }, {
    key: '_handleClick',
    value: function _handleClick(event) {
      var trigger = event.currentTarget;
      var pairing = findPairingFromPairingTrigger(this.pairings, trigger);

      // Fast exit if we can't find the group
      if (pairing === null) return;

      event.preventDefault();

      toggleClass(pairing.trigger, 'active');
      toggleClass(pairing.content, 'active');
      a11y$1.update(this.groupedContent);
    }
  }]);
  return AccordionLayout;
}();

/**
 * Returns an array of nodes related to the heading node.
 * @param {node} heading - The heading node to search for content from.
 * @returns {node[]}
 */
function getHeadingContent(heading) {
  var headingTagNames = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  var tagNameIndex = headingTagNames.indexOf(heading.tagName);
  var content = [];

  var sibling = heading.nextElementSibling;

  while (sibling !== null && (headingTagNames.indexOf(sibling.tagName) === -1 || headingTagNames.indexOf(sibling.tagName) > tagNameIndex)) {
    content.push(sibling);

    sibling = sibling.nextElementSibling;
  }

  return content;
}

/**
 * Returns an object array representing the heading tree from a given node.
 * Root nodes are evaluated differently, and requires the evaluatingRoot flag
 * to be true.
 * @param {node} el - The node being evaluated.
 * @param {node[]} children - The children of the evaluated node.
 * @param {boolean} [evaluatingRoot] - Whether to evaluate as root node.
 * @returns {Object[]}
 */
function getHeadingTree(el, children) {
  var evaluatingRoot = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var headingTagNames = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
  var tagNameIndex = headingTagNames.indexOf(el.tagName);
  var headings = [];

  var currentLowestTagNameIndex = 5;

  for (var i = 0; i < children.length; i += 1) {
    var child = children[i];
    var childTagNameIndex = headingTagNames.indexOf(child.tagName);

    if (childTagNameIndex !== -1 && childTagNameIndex < currentLowestTagNameIndex) {
      currentLowestTagNameIndex = childTagNameIndex;
    }

    if (evaluatingRoot && childTagNameIndex !== -1 && childTagNameIndex <= currentLowestTagNameIndex || !evaluatingRoot && childTagNameIndex !== -1 && childTagNameIndex === tagNameIndex + 1) {
      var siblings = getHeadingContent(child);

      var childNode = {
        el: child,
        content: siblings,
        children: getHeadingTree(child, siblings)
      };

      headings.push(childNode);
    }
  }

  return headings;
}

/**
 * Returns groupings of headings that meet the minimum sequence value
 * and don't contain any invalid headings.
 * @param {Object[]} headings - An array of heading objects.
 * @param {int[]} invalidHeadings - An array of invalid heading integers,
 *                                  representing indexes of headings.
 * @param {*} minInSequence - Minimum headings in sequence before being considered
 *                            as a grouping.
 * @returns {Object[][]}
 */
function getHeadingGroupsInSequence(headings, invalidHeadings, minInSequence) {
  var headingGroupsInSequence = [];
  var currentHeadingGroupInSequence = [];
  var currentSequence = 0;

  for (var i = 0; i < headings.length; i += 1) {
    if (invalidHeadings.indexOf(i) === -1) {
      currentHeadingGroupInSequence.push(headings[i]);
      currentSequence += 1;

      if (i !== headings.length - 1 && headings[i].el.tagName !== headings[i + 1].el.tagName && invalidHeadings.indexOf(i + 1)) {
        currentHeadingGroupInSequence = [];
        currentSequence = 0;
      } else if (i !== 0 && headings[i].el.tagName !== headings[i - 1].el.tagName) {
        currentHeadingGroupInSequence.pop();
        currentSequence -= 1;

        if (currentSequence >= minInSequence) {
          headingGroupsInSequence.push(currentHeadingGroupInSequence);
        }

        currentHeadingGroupInSequence = [headings[i]];
        currentSequence = 1;
      }
    }
  }

  if (currentSequence >= minInSequence) {
    headingGroupsInSequence.push(currentHeadingGroupInSequence);
  }

  return headingGroupsInSequence;
}

/**
 * Generates necessary DOM elements to group related content.
 * Returns a object array representing the grouped content.
 * @param {Object[]} children - An array of objects.
 * @returns {Object[]}
 */
function createGroupedContent(children) {
  var pairings = [];

  var firstChild = children[0].el;
  var triggers = document.createElement('div');
  var contents = document.createElement('div');

  contents = firstChild.parentNode.insertBefore(contents, firstChild.nextSibling);
  triggers = firstChild.parentNode.insertBefore(triggers, firstChild.nextSibling);

  for (var i = 0; i < children.length; i += 1) {
    var child = children[i];
    var trigger = child.el;
    var content = document.createElement('div');

    trigger = triggers.appendChild(trigger);
    content = contents.appendChild(content);

    for (var j = 0; j < child.content.length; j += 1) {
      content.appendChild(child.content[j]);
    }

    pairings.push({
      trigger: trigger,
      content: content
    });
  }

  return {
    triggers: triggers,
    contents: contents,
    pairings: pairings
  };
}

/**
 * Returns all groupable content within the supplied node.
 * @param {node} node - A node to traverse for groupable content.
 * @returns {Object[][]}
 */
/*
 * Recursive function:
 *  Returns all groups of headings that
 *  are elegible to become grouped content.
 */
function getGroupedContentSet(node) {
  var children = node.children;
  var childrenWithGroupableContent = [];
  var groupedContentSet = [];

  if (children.length === 0) {
    return [];
  }

  for (var i = 0; i < children.length; i += 1) {
    var childGroupableContent = getGroupedContentSet(children[i]);

    if (childGroupableContent.length > 0) {
      childrenWithGroupableContent.push(i);
      groupedContentSet = groupedContentSet.concat(childGroupableContent);
    }
  }

  var headingGroupsInSequence = getHeadingGroupsInSequence(children, childrenWithGroupableContent, 3);

  for (var _i = 0; _i < headingGroupsInSequence.length; _i += 1) {
    groupedContentSet.push(createGroupedContent(headingGroupsInSequence[_i]));
  }

  return groupedContentSet;
}

/**
 * When static parsing isn't enough, there's intelliparse™!
 * Searches through dom content to find heading groupings that
 * are elegible to become tab groups.
 * Assumes that content is in a flattened hierarchy in the dom
 * and interprets increasing heading values as a deeper level of nesting.
 * Returns all groupable content as an array of object arrays.
 * @param {node} el - The node who's content will be searched for groupable content.
 * @returns {Object[][]}
 */
function intelliParse(el) {
  var children = el.children;
  var heading = el.querySelector('h1, h2, h3, h4, h5, h6');

  // Fast return if there's no headings
  if (children.length === 0) return [];

  var rootNode = {
    el: el,
    content: null,
    children: getHeadingTree(heading, children, true)
  };

  return getGroupedContentSet(rootNode);
}

/**
 * Parses content from a given node based on a static structure.
 * The structure is as follows:
 * <ul class="tabs">
 *   <li class="active">Tab 1</li>
 *   <li>Tab 2</li>
 *   <li>Tab 3</li>
 * </ul>
 *
 * <ul class="tabs-content">
 *   <li class="active">
 *     <p>Tab 1 content goes here.</p>
 *   </li>
 *   <li>
 *     <p>Tab 2 content goes here.</p>
 *   </li>
 *   <li>
 *     <p>Tab 3 content goes here.</p>
 *   </li>
 * </ul>
 * Returns all groupable content as an array of object arrays.
 * @param {node} el - The node who's content will be searched for groupable content.
 * @returns {Object[][]}
 */
function staticParse(el) {
  var groupedContentSet = [];

  var tabs = el.querySelectorAll('.tabs');

  for (var i = 0; i < tabs.length; i += 1) {
    var triggers = tabs[i].children;
    var contents = tabs[i].nextElementSibling.children;

    // Only add a tab group if equal triggers to contents
    if (triggers.length === contents.length) {
      var length = groupedContentSet.push({
        triggers: tabs[i],
        contents: tabs[i].nextElementSibling,
        pairings: []
      });
      var index = length - 1;

      for (var j = 0; j < triggers.length; j += 1) {
        var trigger = triggers[j];
        var content = contents[j];

        var pairing = {
          trigger: trigger,
          content: content
        };

        groupedContentSet[index].pairings.push(pairing);
      }
    }
  }

  return groupedContentSet;
}

/**
 * Returns all groupable content as an array of object arrays.
 * @param {node} content - The node to parse for groupable content.
 * @param {boolean} intelliparse - Whether to use intelligent parsing.
 * @returns {Object[][]}
 */
function parse(content) {
  var intelliparse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var groupedContentSet = intelliparse ? intelliParse(content) : staticParse(content);

  return groupedContentSet;
}

/** A class for creating, managing, and destroying groupable content. */

var GroupedContent = function () {
  /**
   * Create grouped content
   * @param {node} el - The element to search for groupable content in.
   * @param {Object}  [options] - Additional options
   * @param {string}  [options.layout] - The layout to display groupable content in.
   * @param {boolean} [options.intelliparse] - The parsing algorithm used to find content with.
   */
  function GroupedContent(el) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, GroupedContent);

    this.namespace = 'grouped-content';
    this.el = el;
    this.groupedContentInstances = [];

    var layout = options.layout || 'tabs';
    var intelliparse = !!options.intelliparse;

    forEach(parse(el, intelliparse), function (groupedContent) {
      var id = uuidv4();
      var instance = null;
      var groupedContentWrapper = document.createElement('div');

      groupedContentWrapper = groupedContent.triggers.parentNode.insertBefore(groupedContentWrapper, groupedContent.triggers.nextSibling);

      addClass(groupedContentWrapper, _this.namespace);
      addClass(groupedContentWrapper, _this.namespace + '-layout-' + layout);

      groupedContentWrapper.appendChild(groupedContent.triggers);
      groupedContentWrapper.appendChild(groupedContent.contents);

      groupedContent.namespace = _this.namespace;
      groupedContent.id = id;
      groupedContent.triggers.id = _this.namespace + '-' + id + '-triggers';
      groupedContent.contents.id = _this.namespace + '-' + id + '-contents';

      addClass(groupedContent.triggers, _this.namespace + '-triggers');
      addClass(groupedContent.contents, _this.namespace + '-contents');

      forEach(groupedContent.pairings, function (pairing) {
        addClass(pairing.trigger, _this.namespace + '-trigger');
        addClass(pairing.content, _this.namespace + '-content');
      });

      switch (layout) {
        case 'accordion':
          instance = new AccordionLayout(groupedContent);
          break;
        case 'tabs':
        default:
          instance = new TabsLayout(groupedContent);
          break;
      }

      _this.groupedContentInstances.push({
        groupedContent: groupedContent,
        instance: instance
      });
    });
  }

  /** Unload all grouped content instances */


  createClass(GroupedContent, [{
    key: 'unload',
    value: function unload() {
      forEach(this.groupedContentInstances, function (groupedContentInstance) {
        groupedContentInstance.instance.unload();
      });
    }
  }]);
  return GroupedContent;
}();

module.exports = GroupedContent;


/***/ }),

/***/ 43:
/***/ (function() {

/**
 * Currency Helpers
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */
window.Theme.Currency = function () {
  var moneyFormat = '${{amount}}'; // eslint-disable-line no-template-curly-in-string

  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }

    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    function formatWithDelimiters(number, precision, thousands, decimal) {
      thousands = thousands || ',';
      decimal = decimal || '.';

      if (isNaN(number) || number === null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);
      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1".concat(thousands));
      var centsAmount = parts[1] ? decimal + parts[1] : '';
      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;

      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;

      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;

      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;

      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;

      case 'amount_with_apostrophe_separator':
        value = formatWithDelimiters(cents, 2, "'");
        break;

      default:
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
}();

/***/ }),

/***/ 554:
/***/ (function() {

if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

/***/ }),

/***/ 194:
/***/ (function() {

// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
// Allows use of .forEach on NodeLists in browsers without native support
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

/***/ }),

/***/ 741:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * matchesSelector v2.0.2
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  /*global define: false, module: false */
  'use strict';
  // universal module definition
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory() {
  'use strict';

  var matchesMethod = ( function() {
    var ElemProto = window.Element.prototype;
    // check for the standard method name first
    if ( ElemProto.matches ) {
      return 'matches';
    }
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0; i < prefixes.length; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  return function matchesSelector( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  };

}));


/***/ }),

/***/ 158:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * EvEmitter v1.1.0
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( true ) {
    // AMD - RequireJS
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( typeof window != 'undefined' ? window : this, function() {

"use strict";

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  // copy over to avoid interference if .off() in listener
  listeners = listeners.slice(0);
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  for ( var i=0; i < listeners.length; i++ ) {
    var listener = listeners[i]
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
  }

  return this;
};

proto.allOff = function() {
  delete this._events;
  delete this._onceEvents;
};

return EvEmitter;

}));


/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Fizzy UI utils v2.0.7
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(741)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( matchesSelector ) {
      return factory( window, matchesSelector );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, matchesSelector ) {

'use strict';

var utils = {};

// ----- extend ----- //

// extends objects
utils.extend = function( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
};

// ----- modulo ----- //

utils.modulo = function( num, div ) {
  return ( ( num % div ) + div ) % div;
};

// ----- makeArray ----- //

var arraySlice = Array.prototype.slice;

// turn element or nodeList into an array
utils.makeArray = function( obj ) {
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    return obj;
  }
  // return empty array if undefined or null. #6
  if ( obj === null || obj === undefined ) {
    return [];
  }

  var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
  if ( isArrayLike ) {
    // convert nodeList to array
    return arraySlice.call( obj );
  }

  // array of single index
  return [ obj ];
};

// ----- removeFrom ----- //

utils.removeFrom = function( ary, obj ) {
  var index = ary.indexOf( obj );
  if ( index != -1 ) {
    ary.splice( index, 1 );
  }
};

// ----- getParent ----- //

utils.getParent = function( elem, selector ) {
  while ( elem.parentNode && elem != document.body ) {
    elem = elem.parentNode;
    if ( matchesSelector( elem, selector ) ) {
      return elem;
    }
  }
};

// ----- getQueryElement ----- //

// use element as selector string
utils.getQueryElement = function( elem ) {
  if ( typeof elem == 'string' ) {
    return document.querySelector( elem );
  }
  return elem;
};

// ----- handleEvent ----- //

// enable .ontype to trigger from .addEventListener( elem, 'type' )
utils.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// ----- filterFindElements ----- //

utils.filterFindElements = function( elems, selector ) {
  // make array of elems
  elems = utils.makeArray( elems );
  var ffElems = [];

  elems.forEach( function( elem ) {
    // check that elem is an actual element
    if ( !( elem instanceof HTMLElement ) ) {
      return;
    }
    // add elem if no selector
    if ( !selector ) {
      ffElems.push( elem );
      return;
    }
    // filter & find items if we have a selector
    // filter
    if ( matchesSelector( elem, selector ) ) {
      ffElems.push( elem );
    }
    // find children
    var childElems = elem.querySelectorAll( selector );
    // concat childElems to filterFound array
    for ( var i=0; i < childElems.length; i++ ) {
      ffElems.push( childElems[i] );
    }
  });

  return ffElems;
};

// ----- debounceMethod ----- //

utils.debounceMethod = function( _class, methodName, threshold ) {
  threshold = threshold || 100;
  // original method
  var method = _class.prototype[ methodName ];
  var timeoutName = methodName + 'Timeout';

  _class.prototype[ methodName ] = function() {
    var timeout = this[ timeoutName ];
    clearTimeout( timeout );

    var args = arguments;
    var _this = this;
    this[ timeoutName ] = setTimeout( function() {
      method.apply( _this, args );
      delete _this[ timeoutName ];
    }, threshold );
  };
};

// ----- docReady ----- //

utils.docReady = function( callback ) {
  var readyState = document.readyState;
  if ( readyState == 'complete' || readyState == 'interactive' ) {
    // do async to allow for other scripts to run. metafizzy/flickity#441
    setTimeout( callback );
  } else {
    document.addEventListener( 'DOMContentLoaded', callback );
  }
};

// ----- htmlInit ----- //

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
utils.toDashed = function( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
};

var console = window.console;
/**
 * allow user to initialize classes via [data-namespace] or .js-namespace class
 * htmlInit( Widget, 'widgetName' )
 * options are parsed from data-namespace-options
 */
utils.htmlInit = function( WidgetClass, namespace ) {
  utils.docReady( function() {
    var dashedNamespace = utils.toDashed( namespace );
    var dataAttr = 'data-' + dashedNamespace;
    var dataAttrElems = document.querySelectorAll( '[' + dataAttr + ']' );
    var jsDashElems = document.querySelectorAll( '.js-' + dashedNamespace );
    var elems = utils.makeArray( dataAttrElems )
      .concat( utils.makeArray( jsDashElems ) );
    var dataOptionsAttr = dataAttr + '-options';
    var jQuery = window.jQuery;

    elems.forEach( function( elem ) {
      var attr = elem.getAttribute( dataAttr ) ||
        elem.getAttribute( dataOptionsAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' + elem.className +
          ': ' + error );
        }
        return;
      }
      // initialize
      var instance = new WidgetClass( elem, options );
      // make available via $().data('namespace')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    });

  });
};

// -----  ----- //

return utils;

}));


/***/ }),

/***/ 597:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// add, remove cell
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(47)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, utils ) {
      return factory( window, Flickity, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, utils ) {

'use strict';

// append cells to a document fragment
function getCellsFragment( cells ) {
  var fragment = document.createDocumentFragment();
  cells.forEach( function( cell ) {
    fragment.appendChild( cell.element );
  });
  return fragment;
}

// -------------------------- add/remove cell prototype -------------------------- //

var proto = Flickity.prototype;

/**
 * Insert, prepend, or append cells
 * @param {Element, Array, NodeList} elems
 * @param {Integer} index
 */
proto.insert = function( elems, index ) {
  var cells = this._makeCells( elems );
  if ( !cells || !cells.length ) {
    return;
  }
  var len = this.cells.length;
  // default to append
  index = index === undefined ? len : index;
  // add cells with document fragment
  var fragment = getCellsFragment( cells );
  // append to slider
  var isAppend = index == len;
  if ( isAppend ) {
    this.slider.appendChild( fragment );
  } else {
    var insertCellElement = this.cells[ index ].element;
    this.slider.insertBefore( fragment, insertCellElement );
  }
  // add to this.cells
  if ( index === 0 ) {
    // prepend, add to start
    this.cells = cells.concat( this.cells );
  } else if ( isAppend ) {
    // append, add to end
    this.cells = this.cells.concat( cells );
  } else {
    // insert in this.cells
    var endCells = this.cells.splice( index, len - index );
    this.cells = this.cells.concat( cells ).concat( endCells );
  }

  this._sizeCells( cells );
  this.cellChange( index, true );
};

proto.append = function( elems ) {
  this.insert( elems, this.cells.length );
};

proto.prepend = function( elems ) {
  this.insert( elems, 0 );
};

/**
 * Remove cells
 * @param {Element, Array, NodeList} elems
 */
proto.remove = function( elems ) {
  var cells = this.getCells( elems );
  if ( !cells || !cells.length ) {
    return;
  }

  var minCellIndex = this.cells.length - 1;
  // remove cells from collection & DOM
  cells.forEach( function( cell ) {
    cell.remove();
    var index = this.cells.indexOf( cell );
    minCellIndex = Math.min( index, minCellIndex );
    utils.removeFrom( this.cells, cell );
  }, this );

  this.cellChange( minCellIndex, true );
};

/**
 * logic to be run after a cell's size changes
 * @param {Element} elem - cell's element
 */
proto.cellSizeChange = function( elem ) {
  var cell = this.getCell( elem );
  if ( !cell ) {
    return;
  }
  cell.getSize();

  var index = this.cells.indexOf( cell );
  this.cellChange( index );
};

/**
 * logic any time a cell is changed: added, removed, or size changed
 * @param {Integer} changedCellIndex - index of the changed cell, optional
 */
proto.cellChange = function( changedCellIndex, isPositioningSlider ) {
  var prevSelectedElem = this.selectedElement;
  this._positionCells( changedCellIndex );
  this._getWrapShiftCells();
  this.setGallerySize();
  // update selectedIndex
  // try to maintain position & select previous selected element
  var cell = this.getCell( prevSelectedElem );
  if ( cell ) {
    this.selectedIndex = this.getCellSlideIndex( cell );
  }
  this.selectedIndex = Math.min( this.slides.length - 1, this.selectedIndex );

  this.emitEvent( 'cellChange', [ changedCellIndex ] );
  // position slider
  this.select( this.selectedIndex );
  // do not position slider after lazy load
  if ( isPositioningSlider ) {
    this.positionSliderAtSelected();
  }
};

// -----  ----- //

return Flickity;

}));


/***/ }),

/***/ 880:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// animate
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(47)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( utils ) {
      return factory( window, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, utils ) {

'use strict';

// -------------------------- animate -------------------------- //

var proto = {};

proto.startAnimation = function() {
  if ( this.isAnimating ) {
    return;
  }

  this.isAnimating = true;
  this.restingFrames = 0;
  this.animate();
};

proto.animate = function() {
  this.applyDragForce();
  this.applySelectedAttraction();

  var previousX = this.x;

  this.integratePhysics();
  this.positionSlider();
  this.settle( previousX );
  // animate next frame
  if ( this.isAnimating ) {
    var _this = this;
    requestAnimationFrame( function animateFrame() {
      _this.animate();
    });
  }
};

proto.positionSlider = function() {
  var x = this.x;
  // wrap position around
  if ( this.options.wrapAround && this.cells.length > 1 ) {
    x = utils.modulo( x, this.slideableWidth );
    x = x - this.slideableWidth;
    this.shiftWrapCells( x );
  }

  this.setTranslateX( x, this.isAnimating );
  this.dispatchScrollEvent();
};

proto.setTranslateX = function( x, is3d ) {
  x += this.cursorPosition;
  // reverse if right-to-left and using transform
  x = this.options.rightToLeft ? -x : x;
  var translateX = this.getPositionValue( x );
  // use 3D tranforms for hardware acceleration on iOS
  // but use 2D when settled, for better font-rendering
  this.slider.style.transform = is3d ?
    'translate3d(' + translateX + ',0,0)' : 'translateX(' + translateX + ')';
};

proto.dispatchScrollEvent = function() {
  var firstSlide = this.slides[0];
  if ( !firstSlide ) {
    return;
  }
  var positionX = -this.x - firstSlide.target;
  var progress = positionX / this.slidesWidth;
  this.dispatchEvent( 'scroll', null, [ progress, positionX ] );
};

proto.positionSliderAtSelected = function() {
  if ( !this.cells.length ) {
    return;
  }
  this.x = -this.selectedSlide.target;
  this.velocity = 0; // stop wobble
  this.positionSlider();
};

proto.getPositionValue = function( position ) {
  if ( this.options.percentPosition ) {
    // percent position, round to 2 digits, like 12.34%
    return ( Math.round( ( position / this.size.innerWidth ) * 10000 ) * 0.01 )+ '%';
  } else {
    // pixel positioning
    return Math.round( position ) + 'px';
  }
};

proto.settle = function( previousX ) {
  // keep track of frames where x hasn't moved
  if ( !this.isPointerDown && Math.round( this.x * 100 ) == Math.round( previousX * 100 ) ) {
    this.restingFrames++;
  }
  // stop animating if resting for 3 or more frames
  if ( this.restingFrames > 2 ) {
    this.isAnimating = false;
    delete this.isFreeScrolling;
    // render position with translateX when settled
    this.positionSlider();
    this.dispatchEvent( 'settle', null, [ this.selectedIndex ] );
  }
};

proto.shiftWrapCells = function( x ) {
  // shift before cells
  var beforeGap = this.cursorPosition + x;
  this._shiftCells( this.beforeShiftCells, beforeGap, -1 );
  // shift after cells
  var afterGap = this.size.innerWidth - ( x + this.slideableWidth + this.cursorPosition );
  this._shiftCells( this.afterShiftCells, afterGap, 1 );
};

proto._shiftCells = function( cells, gap, shift ) {
  for ( var i=0; i < cells.length; i++ ) {
    var cell = cells[i];
    var cellShift = gap > 0 ? shift : 0;
    cell.wrapShift( cellShift );
    gap -= cell.size.outerWidth;
  }
};

proto._unshiftCells = function( cells ) {
  if ( !cells || !cells.length ) {
    return;
  }
  for ( var i=0; i < cells.length; i++ ) {
    cells[i].wrapShift( 0 );
  }
};

// -------------------------- physics -------------------------- //

proto.integratePhysics = function() {
  this.x += this.velocity;
  this.velocity *= this.getFrictionFactor();
};

proto.applyForce = function( force ) {
  this.velocity += force;
};

proto.getFrictionFactor = function() {
  return 1 - this.options[ this.isFreeScrolling ? 'freeScrollFriction' : 'friction' ];
};

proto.getRestingPosition = function() {
  // my thanks to Steven Wittens, who simplified this math greatly
  return this.x + this.velocity / ( 1 - this.getFrictionFactor() );
};

proto.applyDragForce = function() {
  if ( !this.isDraggable || !this.isPointerDown ) {
    return;
  }
  // change the position to drag position by applying force
  var dragVelocity = this.dragX - this.x;
  var dragForce = dragVelocity - this.velocity;
  this.applyForce( dragForce );
};

proto.applySelectedAttraction = function() {
  // do not attract if pointer down or no slides
  var dragDown = this.isDraggable && this.isPointerDown;
  if ( dragDown || this.isFreeScrolling || !this.slides.length ) {
    return;
  }
  var distance = this.selectedSlide.target * -1 - this.x;
  var force = distance * this.options.selectedAttraction;
  this.applyForce( force );
};

return proto;

}));


/***/ }),

/***/ 229:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Flickity.Cell
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(131)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( getSize ) {
      return factory( window, getSize );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, getSize ) {

'use strict';

function Cell( elem, parent ) {
  this.element = elem;
  this.parent = parent;

  this.create();
}

var proto = Cell.prototype;

proto.create = function() {
  this.element.style.position = 'absolute';
  this.element.setAttribute( 'aria-hidden', 'true' );
  this.x = 0;
  this.shift = 0;
};

proto.destroy = function() {
  // reset style
  this.unselect();
  this.element.style.position = '';
  var side = this.parent.originSide;
  this.element.style[ side ] = '';
};

proto.getSize = function() {
  this.size = getSize( this.element );
};

proto.setPosition = function( x ) {
  this.x = x;
  this.updateTarget();
  this.renderPosition( x );
};

// setDefaultTarget v1 method, backwards compatibility, remove in v3
proto.updateTarget = proto.setDefaultTarget = function() {
  var marginProperty = this.parent.originSide == 'left' ? 'marginLeft' : 'marginRight';
  this.target = this.x + this.size[ marginProperty ] +
    this.size.width * this.parent.cellAlign;
};

proto.renderPosition = function( x ) {
  // render position of cell with in slider
  var side = this.parent.originSide;
  this.element.style[ side ] = this.parent.getPositionValue( x );
};

proto.select = function() {
  this.element.classList.add('is-selected');
  this.element.removeAttribute('aria-hidden');
};

proto.unselect = function() {
  this.element.classList.remove('is-selected');
  this.element.setAttribute( 'aria-hidden', 'true' );
};

/**
 * @param {Integer} factor - 0, 1, or -1
**/
proto.wrapShift = function( shift ) {
  this.shift = shift;
  this.renderPosition( this.x + this.parent.slideableWidth * shift );
};

proto.remove = function() {
  this.element.parentNode.removeChild( this.element );
};

return Cell;

}));


/***/ }),

/***/ 690:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// drag
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(842),
      __webpack_require__(47)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, Unidragger, utils ) {
      return factory( window, Flickity, Unidragger, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, Unidragger, utils ) {

'use strict';

// ----- defaults ----- //

utils.extend( Flickity.defaults, {
  draggable: '>1',
  dragThreshold: 3,
});

// ----- create ----- //

Flickity.createMethods.push('_createDrag');

// -------------------------- drag prototype -------------------------- //

var proto = Flickity.prototype;
utils.extend( proto, Unidragger.prototype );
proto._touchActionValue = 'pan-y';

// --------------------------  -------------------------- //

var isTouch = 'createTouch' in document;
var isTouchmoveScrollCanceled = false;

proto._createDrag = function() {
  this.on( 'activate', this.onActivateDrag );
  this.on( 'uiChange', this._uiChangeDrag );
  this.on( 'deactivate', this.onDeactivateDrag );
  this.on( 'cellChange', this.updateDraggable );
  // TODO updateDraggable on resize? if groupCells & slides change
  // HACK - add seemingly innocuous handler to fix iOS 10 scroll behavior
  // #457, RubaXa/Sortable#973
  if ( isTouch && !isTouchmoveScrollCanceled ) {
    window.addEventListener( 'touchmove', function() {});
    isTouchmoveScrollCanceled = true;
  }
};

proto.onActivateDrag = function() {
  this.handles = [ this.viewport ];
  this.bindHandles();
  this.updateDraggable();
};

proto.onDeactivateDrag = function() {
  this.unbindHandles();
  this.element.classList.remove('is-draggable');
};

proto.updateDraggable = function() {
  // disable dragging if less than 2 slides. #278
  if ( this.options.draggable == '>1' ) {
    this.isDraggable = this.slides.length > 1;
  } else {
    this.isDraggable = this.options.draggable;
  }
  if ( this.isDraggable ) {
    this.element.classList.add('is-draggable');
  } else {
    this.element.classList.remove('is-draggable');
  }
};

// backwards compatibility
proto.bindDrag = function() {
  this.options.draggable = true;
  this.updateDraggable();
};

proto.unbindDrag = function() {
  this.options.draggable = false;
  this.updateDraggable();
};

proto._uiChangeDrag = function() {
  delete this.isFreeScrolling;
};

// -------------------------- pointer events -------------------------- //

proto.pointerDown = function( event, pointer ) {
  if ( !this.isDraggable ) {
    this._pointerDownDefault( event, pointer );
    return;
  }
  var isOkay = this.okayPointerDown( event );
  if ( !isOkay ) {
    return;
  }

  this._pointerDownPreventDefault( event );
  this.pointerDownFocus( event );
  // blur
  if ( document.activeElement != this.element ) {
    // do not blur if already focused
    this.pointerDownBlur();
  }

  // stop if it was moving
  this.dragX = this.x;
  this.viewport.classList.add('is-pointer-down');
  // track scrolling
  this.pointerDownScroll = getScrollPosition();
  window.addEventListener( 'scroll', this );

  this._pointerDownDefault( event, pointer );
};

// default pointerDown logic, used for staticClick
proto._pointerDownDefault = function( event, pointer ) {
  // track start event position
  // Safari 9 overrides pageX and pageY. These values needs to be copied. #779
  this.pointerDownPointer = {
    pageX: pointer.pageX,
    pageY: pointer.pageY,
  };
  // bind move and end events
  this._bindPostStartEvents( event );
  this.dispatchEvent( 'pointerDown', event, [ pointer ] );
};

var focusNodes = {
  INPUT: true,
  TEXTAREA: true,
  SELECT: true,
};

proto.pointerDownFocus = function( event ) {
  var isFocusNode = focusNodes[ event.target.nodeName ];
  if ( !isFocusNode ) {
    this.focus();
  }
};

proto._pointerDownPreventDefault = function( event ) {
  var isTouchStart = event.type == 'touchstart';
  var isTouchPointer = event.pointerType == 'touch';
  var isFocusNode = focusNodes[ event.target.nodeName ];
  if ( !isTouchStart && !isTouchPointer && !isFocusNode ) {
    event.preventDefault();
  }
};

// ----- move ----- //

proto.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > this.options.dragThreshold;
};

// ----- up ----- //

proto.pointerUp = function( event, pointer ) {
  delete this.isTouchScrolling;
  this.viewport.classList.remove('is-pointer-down');
  this.dispatchEvent( 'pointerUp', event, [ pointer ] );
  this._dragPointerUp( event, pointer );
};

proto.pointerDone = function() {
  window.removeEventListener( 'scroll', this );
  delete this.pointerDownScroll;
};

// -------------------------- dragging -------------------------- //

proto.dragStart = function( event, pointer ) {
  if ( !this.isDraggable ) {
    return;
  }
  this.dragStartPosition = this.x;
  this.startAnimation();
  window.removeEventListener( 'scroll', this );
  this.dispatchEvent( 'dragStart', event, [ pointer ] );
};

proto.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.dispatchEvent( 'pointerMove', event, [ pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

proto.dragMove = function( event, pointer, moveVector ) {
  if ( !this.isDraggable ) {
    return;
  }
  event.preventDefault();

  this.previousDragX = this.dragX;
  // reverse if right-to-left
  var direction = this.options.rightToLeft ? -1 : 1;
  if ( this.options.wrapAround ) {
    // wrap around move. #589
    moveVector.x = moveVector.x % this.slideableWidth;
  }
  var dragX = this.dragStartPosition + moveVector.x * direction;

  if ( !this.options.wrapAround && this.slides.length ) {
    // slow drag
    var originBound = Math.max( -this.slides[0].target, this.dragStartPosition );
    dragX = dragX > originBound ? ( dragX + originBound ) * 0.5 : dragX;
    var endBound = Math.min( -this.getLastSlide().target, this.dragStartPosition );
    dragX = dragX < endBound ? ( dragX + endBound ) * 0.5 : dragX;
  }

  this.dragX = dragX;

  this.dragMoveTime = new Date();
  this.dispatchEvent( 'dragMove', event, [ pointer, moveVector ] );
};

proto.dragEnd = function( event, pointer ) {
  if ( !this.isDraggable ) {
    return;
  }
  if ( this.options.freeScroll ) {
    this.isFreeScrolling = true;
  }
  // set selectedIndex based on where flick will end up
  var index = this.dragEndRestingSelect();

  if ( this.options.freeScroll && !this.options.wrapAround ) {
    // if free-scroll & not wrap around
    // do not free-scroll if going outside of bounding slides
    // so bounding slides can attract slider, and keep it in bounds
    var restingX = this.getRestingPosition();
    this.isFreeScrolling = -restingX > this.slides[0].target &&
      -restingX < this.getLastSlide().target;
  } else if ( !this.options.freeScroll && index == this.selectedIndex ) {
    // boost selection if selected index has not changed
    index += this.dragEndBoostSelect();
  }
  delete this.previousDragX;
  // apply selection
  // TODO refactor this, selecting here feels weird
  // HACK, set flag so dragging stays in correct direction
  this.isDragSelect = this.options.wrapAround;
  this.select( index );
  delete this.isDragSelect;
  this.dispatchEvent( 'dragEnd', event, [ pointer ] );
};

proto.dragEndRestingSelect = function() {
  var restingX = this.getRestingPosition();
  // how far away from selected slide
  var distance = Math.abs( this.getSlideDistance( -restingX, this.selectedIndex ) );
  // get closet resting going up and going down
  var positiveResting = this._getClosestResting( restingX, distance, 1 );
  var negativeResting = this._getClosestResting( restingX, distance, -1 );
  // use closer resting for wrap-around
  var index = positiveResting.distance < negativeResting.distance ?
    positiveResting.index : negativeResting.index;
  return index;
};

/**
 * given resting X and distance to selected cell
 * get the distance and index of the closest cell
 * @param {Number} restingX - estimated post-flick resting position
 * @param {Number} distance - distance to selected cell
 * @param {Integer} increment - +1 or -1, going up or down
 * @returns {Object} - { distance: {Number}, index: {Integer} }
 */
proto._getClosestResting = function( restingX, distance, increment ) {
  var index = this.selectedIndex;
  var minDistance = Infinity;
  var condition = this.options.contain && !this.options.wrapAround ?
    // if contain, keep going if distance is equal to minDistance
    function( d, md ) { return d <= md; } : function( d, md ) { return d < md; };
  while ( condition( distance, minDistance ) ) {
    // measure distance to next cell
    index += increment;
    minDistance = distance;
    distance = this.getSlideDistance( -restingX, index );
    if ( distance === null ) {
      break;
    }
    distance = Math.abs( distance );
  }
  return {
    distance: minDistance,
    // selected was previous index
    index: index - increment
  };
};

/**
 * measure distance between x and a slide target
 * @param {Number} x
 * @param {Integer} index - slide index
 */
proto.getSlideDistance = function( x, index ) {
  var len = this.slides.length;
  // wrap around if at least 2 slides
  var isWrapAround = this.options.wrapAround && len > 1;
  var slideIndex = isWrapAround ? utils.modulo( index, len ) : index;
  var slide = this.slides[ slideIndex ];
  if ( !slide ) {
    return null;
  }
  // add distance for wrap-around slides
  var wrap = isWrapAround ? this.slideableWidth * Math.floor( index / len ) : 0;
  return x - ( slide.target + wrap );
};

proto.dragEndBoostSelect = function() {
  // do not boost if no previousDragX or dragMoveTime
  if ( this.previousDragX === undefined || !this.dragMoveTime ||
    // or if drag was held for 100 ms
    new Date() - this.dragMoveTime > 100 ) {
    return 0;
  }

  var distance = this.getSlideDistance( -this.dragX, this.selectedIndex );
  var delta = this.previousDragX - this.dragX;
  if ( distance > 0 && delta > 0 ) {
    // boost to next if moving towards the right, and positive velocity
    return 1;
  } else if ( distance < 0 && delta < 0 ) {
    // boost to previous if moving towards the left, and negative velocity
    return -1;
  }
  return 0;
};

// ----- staticClick ----- //

proto.staticClick = function( event, pointer ) {
  // get clickedCell, if cell was clicked
  var clickedCell = this.getParentCell( event.target );
  var cellElem = clickedCell && clickedCell.element;
  var cellIndex = clickedCell && this.cells.indexOf( clickedCell );
  this.dispatchEvent( 'staticClick', event, [ pointer, cellElem, cellIndex ] );
};

// ----- scroll ----- //

proto.onscroll = function() {
  var scroll = getScrollPosition();
  var scrollMoveX = this.pointerDownScroll.x - scroll.x;
  var scrollMoveY = this.pointerDownScroll.y - scroll.y;
  // cancel click/tap if scroll is too much
  if ( Math.abs( scrollMoveX ) > 3 || Math.abs( scrollMoveY ) > 3 ) {
    this._pointerDone();
  }
};

// ----- utils ----- //

function getScrollPosition() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset
  };
}

// -----  ----- //

return Flickity;

}));


/***/ }),

/***/ 217:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Flickity main
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(158),
      __webpack_require__(131),
      __webpack_require__(47),
      __webpack_require__(229),
      __webpack_require__(714),
      __webpack_require__(880)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( EvEmitter, getSize, utils, Cell, Slide, animatePrototype ) {
      return factory( window, EvEmitter, getSize, utils, Cell, Slide, animatePrototype );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else { var _Flickity; }

}( window, function factory( window, EvEmitter, getSize,
  utils, Cell, Slide, animatePrototype ) {

'use strict';

// vars
var jQuery = window.jQuery;
var getComputedStyle = window.getComputedStyle;
var console = window.console;

function moveElements( elems, toElem ) {
  elems = utils.makeArray( elems );
  while ( elems.length ) {
    toElem.appendChild( elems.shift() );
  }
}

// -------------------------- Flickity -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Flickity intances
var instances = {};

function Flickity( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for Flickity: ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // do not initialize twice on same element
  if ( this.element.flickityGUID ) {
    var instance = instances[ this.element.flickityGUID ];
    instance.option( options );
    return instance;
  }

  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }
  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // kick things off
  this._create();
}

Flickity.defaults = {
  accessibility: true,
  // adaptiveHeight: false,
  cellAlign: 'center',
  // cellSelector: undefined,
  // contain: false,
  freeScrollFriction: 0.075, // friction when free-scrolling
  friction: 0.28, // friction when selecting
  namespaceJQueryEvents: true,
  // initialIndex: 0,
  percentPosition: true,
  resize: true,
  selectedAttraction: 0.025,
  setGallerySize: true
  // watchCSS: false,
  // wrapAround: false
};

// hash of methods triggered on _create()
Flickity.createMethods = [];

var proto = Flickity.prototype;
// inherit EventEmitter
utils.extend( proto, EvEmitter.prototype );

proto._create = function() {
  // add id for Flickity.data
  var id = this.guid = ++GUID;
  this.element.flickityGUID = id; // expando
  instances[ id ] = this; // associate via id
  // initial properties
  this.selectedIndex = 0;
  // how many frames slider has been in same position
  this.restingFrames = 0;
  // initial physics properties
  this.x = 0;
  this.velocity = 0;
  this.originSide = this.options.rightToLeft ? 'right' : 'left';
  // create viewport & slider
  this.viewport = document.createElement('div');
  this.viewport.className = 'flickity-viewport';
  this._createSlider();

  if ( this.options.resize || this.options.watchCSS ) {
    window.addEventListener( 'resize', this );
  }

  // add listeners from on option
  for ( var eventName in this.options.on ) {
    var listener = this.options.on[ eventName ];
    this.on( eventName, listener );
  }

  Flickity.createMethods.forEach( function( method ) {
    this[ method ]();
  }, this );

  if ( this.options.watchCSS ) {
    this.watchCSS();
  } else {
    this.activate();
  }

};

/**
 * set options
 * @param {Object} opts
 */
proto.option = function( opts ) {
  utils.extend( this.options, opts );
};

proto.activate = function() {
  if ( this.isActive ) {
    return;
  }
  this.isActive = true;
  this.element.classList.add('flickity-enabled');
  if ( this.options.rightToLeft ) {
    this.element.classList.add('flickity-rtl');
  }

  this.getSize();
  // move initial cell elements so they can be loaded as cells
  var cellElems = this._filterFindCellElements( this.element.children );
  moveElements( cellElems, this.slider );
  this.viewport.appendChild( this.slider );
  this.element.appendChild( this.viewport );
  // get cells from children
  this.reloadCells();

  if ( this.options.accessibility ) {
    // allow element to focusable
    this.element.tabIndex = 0;
    // listen for key presses
    this.element.addEventListener( 'keydown', this );
  }

  this.emitEvent('activate');
  this.selectInitialIndex();
  // flag for initial activation, for using initialIndex
  this.isInitActivated = true;
  // ready event. #493
  this.dispatchEvent('ready');
};

// slider positions the cells
proto._createSlider = function() {
  // slider element does all the positioning
  var slider = document.createElement('div');
  slider.className = 'flickity-slider';
  slider.style[ this.originSide ] = 0;
  this.slider = slider;
};

proto._filterFindCellElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.cellSelector );
};

// goes through all children
proto.reloadCells = function() {
  // collection of item elements
  this.cells = this._makeCells( this.slider.children );
  this.positionCells();
  this._getWrapShiftCells();
  this.setGallerySize();
};

/**
 * turn elements into Flickity.Cells
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Flickity Cells
 */
proto._makeCells = function( elems ) {
  var cellElems = this._filterFindCellElements( elems );

  // create new Flickity for collection
  var cells = cellElems.map( function( cellElem ) {
    return new Cell( cellElem, this );
  }, this );

  return cells;
};

proto.getLastCell = function() {
  return this.cells[ this.cells.length - 1 ];
};

proto.getLastSlide = function() {
  return this.slides[ this.slides.length - 1 ];
};

// positions all cells
proto.positionCells = function() {
  // size all cells
  this._sizeCells( this.cells );
  // position all cells
  this._positionCells( 0 );
};

/**
 * position certain cells
 * @param {Integer} index - which cell to start with
 */
proto._positionCells = function( index ) {
  index = index || 0;
  // also measure maxCellHeight
  // start 0 if positioning all cells
  this.maxCellHeight = index ? this.maxCellHeight || 0 : 0;
  var cellX = 0;
  // get cellX
  if ( index > 0 ) {
    var startCell = this.cells[ index - 1 ];
    cellX = startCell.x + startCell.size.outerWidth;
  }
  var len = this.cells.length;
  for ( var i=index; i < len; i++ ) {
    var cell = this.cells[i];
    cell.setPosition( cellX );
    cellX += cell.size.outerWidth;
    this.maxCellHeight = Math.max( cell.size.outerHeight, this.maxCellHeight );
  }
  // keep track of cellX for wrap-around
  this.slideableWidth = cellX;
  // slides
  this.updateSlides();
  // contain slides target
  this._containSlides();
  // update slidesWidth
  this.slidesWidth = len ? this.getLastSlide().target - this.slides[0].target : 0;
};

/**
 * cell.getSize() on multiple cells
 * @param {Array} cells
 */
proto._sizeCells = function( cells ) {
  cells.forEach( function( cell ) {
    cell.getSize();
  });
};

// --------------------------  -------------------------- //

proto.updateSlides = function() {
  this.slides = [];
  if ( !this.cells.length ) {
    return;
  }

  var slide = new Slide( this );
  this.slides.push( slide );
  var isOriginLeft = this.originSide == 'left';
  var nextMargin = isOriginLeft ? 'marginRight' : 'marginLeft';

  var canCellFit = this._getCanCellFit();

  this.cells.forEach( function( cell, i ) {
    // just add cell if first cell in slide
    if ( !slide.cells.length ) {
      slide.addCell( cell );
      return;
    }

    var slideWidth = ( slide.outerWidth - slide.firstMargin ) +
      ( cell.size.outerWidth - cell.size[ nextMargin ] );

    if ( canCellFit.call( this, i, slideWidth ) ) {
      slide.addCell( cell );
    } else {
      // doesn't fit, new slide
      slide.updateTarget();

      slide = new Slide( this );
      this.slides.push( slide );
      slide.addCell( cell );
    }
  }, this );
  // last slide
  slide.updateTarget();
  // update .selectedSlide
  this.updateSelectedSlide();
};

proto._getCanCellFit = function() {
  var groupCells = this.options.groupCells;
  if ( !groupCells ) {
    return function() {
      return false;
    };
  } else if ( typeof groupCells == 'number' ) {
    // group by number. 3 -> [0,1,2], [3,4,5], ...
    var number = parseInt( groupCells, 10 );
    return function( i ) {
      return ( i % number ) !== 0;
    };
  }
  // default, group by width of slide
  // parse '75%
  var percentMatch = typeof groupCells == 'string' &&
    groupCells.match(/^(\d+)%$/);
  var percent = percentMatch ? parseInt( percentMatch[1], 10 ) / 100 : 1;
  return function( i, slideWidth ) {
    return slideWidth <= ( this.size.innerWidth + 1 ) * percent;
  };
};

// alias _init for jQuery plugin .flickity()
proto._init =
proto.reposition = function() {
  this.positionCells();
  this.positionSliderAtSelected();
};

proto.getSize = function() {
  this.size = getSize( this.element );
  this.setCellAlign();
  this.cursorPosition = this.size.innerWidth * this.cellAlign;
};

var cellAlignShorthands = {
  // cell align, then based on origin side
  center: {
    left: 0.5,
    right: 0.5
  },
  left: {
    left: 0,
    right: 1
  },
  right: {
    right: 0,
    left: 1
  }
};

proto.setCellAlign = function() {
  var shorthand = cellAlignShorthands[ this.options.cellAlign ];
  this.cellAlign = shorthand ? shorthand[ this.originSide ] : this.options.cellAlign;
};

proto.setGallerySize = function() {
  if ( this.options.setGallerySize ) {
    var height = this.options.adaptiveHeight && this.selectedSlide ?
      this.selectedSlide.height : this.maxCellHeight;
    this.viewport.style.height = height + 'px';
  }
};

proto._getWrapShiftCells = function() {
  // only for wrap-around
  if ( !this.options.wrapAround ) {
    return;
  }
  // unshift previous cells
  this._unshiftCells( this.beforeShiftCells );
  this._unshiftCells( this.afterShiftCells );
  // get before cells
  // initial gap
  var gapX = this.cursorPosition;
  var cellIndex = this.cells.length - 1;
  this.beforeShiftCells = this._getGapCells( gapX, cellIndex, -1 );
  // get after cells
  // ending gap between last cell and end of gallery viewport
  gapX = this.size.innerWidth - this.cursorPosition;
  // start cloning at first cell, working forwards
  this.afterShiftCells = this._getGapCells( gapX, 0, 1 );
};

proto._getGapCells = function( gapX, cellIndex, increment ) {
  // keep adding cells until the cover the initial gap
  var cells = [];
  while ( gapX > 0 ) {
    var cell = this.cells[ cellIndex ];
    if ( !cell ) {
      break;
    }
    cells.push( cell );
    cellIndex += increment;
    gapX -= cell.size.outerWidth;
  }
  return cells;
};

// ----- contain ----- //

// contain cell targets so no excess sliding
proto._containSlides = function() {
  if ( !this.options.contain || this.options.wrapAround || !this.cells.length ) {
    return;
  }
  var isRightToLeft = this.options.rightToLeft;
  var beginMargin = isRightToLeft ? 'marginRight' : 'marginLeft';
  var endMargin = isRightToLeft ? 'marginLeft' : 'marginRight';
  var contentWidth = this.slideableWidth - this.getLastCell().size[ endMargin ];
  // content is less than gallery size
  var isContentSmaller = contentWidth < this.size.innerWidth;
  // bounds
  var beginBound = this.cursorPosition + this.cells[0].size[ beginMargin ];
  var endBound = contentWidth - this.size.innerWidth * ( 1 - this.cellAlign );
  // contain each cell target
  this.slides.forEach( function( slide ) {
    if ( isContentSmaller ) {
      // all cells fit inside gallery
      slide.target = contentWidth * this.cellAlign;
    } else {
      // contain to bounds
      slide.target = Math.max( slide.target, beginBound );
      slide.target = Math.min( slide.target, endBound );
    }
  }, this );
};

// -----  ----- //

/**
 * emits events via eventEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
proto.dispatchEvent = function( type, event, args ) {
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery && this.$element ) {
    // default trigger with type if no event
    type += this.options.namespaceJQueryEvents ? '.flickity' : '';
    var $event = type;
    if ( event ) {
      // create jQuery event
      var jQEvent = jQuery.Event( event );
      jQEvent.type = type;
      $event = jQEvent;
    }
    this.$element.trigger( $event, args );
  }
};

// -------------------------- select -------------------------- //

/**
 * @param {Integer} index - index of the slide
 * @param {Boolean} isWrap - will wrap-around to last/first if at the end
 * @param {Boolean} isInstant - will immediately set position at selected cell
 */
proto.select = function( index, isWrap, isInstant ) {
  if ( !this.isActive ) {
    return;
  }
  index = parseInt( index, 10 );
  this._wrapSelect( index );

  if ( this.options.wrapAround || isWrap ) {
    index = utils.modulo( index, this.slides.length );
  }
  // bail if invalid index
  if ( !this.slides[ index ] ) {
    return;
  }
  var prevIndex = this.selectedIndex;
  this.selectedIndex = index;
  this.updateSelectedSlide();
  if ( isInstant ) {
    this.positionSliderAtSelected();
  } else {
    this.startAnimation();
  }
  if ( this.options.adaptiveHeight ) {
    this.setGallerySize();
  }
  // events
  this.dispatchEvent( 'select', null, [ index ] );
  // change event if new index
  if ( index != prevIndex ) {
    this.dispatchEvent( 'change', null, [ index ] );
  }
  // old v1 event name, remove in v3
  this.dispatchEvent('cellSelect');
};

// wraps position for wrapAround, to move to closest slide. #113
proto._wrapSelect = function( index ) {
  var len = this.slides.length;
  var isWrapping = this.options.wrapAround && len > 1;
  if ( !isWrapping ) {
    return index;
  }
  var wrapIndex = utils.modulo( index, len );
  // go to shortest
  var delta = Math.abs( wrapIndex - this.selectedIndex );
  var backWrapDelta = Math.abs( ( wrapIndex + len ) - this.selectedIndex );
  var forewardWrapDelta = Math.abs( ( wrapIndex - len ) - this.selectedIndex );
  if ( !this.isDragSelect && backWrapDelta < delta ) {
    index += len;
  } else if ( !this.isDragSelect && forewardWrapDelta < delta ) {
    index -= len;
  }
  // wrap position so slider is within normal area
  if ( index < 0 ) {
    this.x -= this.slideableWidth;
  } else if ( index >= len ) {
    this.x += this.slideableWidth;
  }
};

proto.previous = function( isWrap, isInstant ) {
  this.select( this.selectedIndex - 1, isWrap, isInstant );
};

proto.next = function( isWrap, isInstant ) {
  this.select( this.selectedIndex + 1, isWrap, isInstant );
};

proto.updateSelectedSlide = function() {
  var slide = this.slides[ this.selectedIndex ];
  // selectedIndex could be outside of slides, if triggered before resize()
  if ( !slide ) {
    return;
  }
  // unselect previous selected slide
  this.unselectSelectedSlide();
  // update new selected slide
  this.selectedSlide = slide;
  slide.select();
  this.selectedCells = slide.cells;
  this.selectedElements = slide.getCellElements();
  // HACK: selectedCell & selectedElement is first cell in slide, backwards compatibility
  // Remove in v3?
  this.selectedCell = slide.cells[0];
  this.selectedElement = this.selectedElements[0];
};

proto.unselectSelectedSlide = function() {
  if ( this.selectedSlide ) {
    this.selectedSlide.unselect();
  }
};

proto.selectInitialIndex = function() {
  var initialIndex = this.options.initialIndex;
  // already activated, select previous selectedIndex
  if ( this.isInitActivated ) {
    this.select( this.selectedIndex, false, true );
    return;
  }
  // select with selector string
  if ( initialIndex && typeof initialIndex == 'string' ) {
    var cell = this.queryCell( initialIndex );
    if ( cell ) {
      this.selectCell( initialIndex, false, true );
      return;
    }
  }

  var index = 0;
  // select with number
  if ( initialIndex && this.slides[ initialIndex ] ) {
    index = initialIndex;
  }
  // select instantly
  this.select( index, false, true );
};

/**
 * select slide from number or cell element
 * @param {Element or Number} elem
 */
proto.selectCell = function( value, isWrap, isInstant ) {
  // get cell
  var cell = this.queryCell( value );
  if ( !cell ) {
    return;
  }

  var index = this.getCellSlideIndex( cell );
  this.select( index, isWrap, isInstant );
};

proto.getCellSlideIndex = function( cell ) {
  // get index of slides that has cell
  for ( var i=0; i < this.slides.length; i++ ) {
    var slide = this.slides[i];
    var index = slide.cells.indexOf( cell );
    if ( index != -1 ) {
      return i;
    }
  }
};

// -------------------------- get cells -------------------------- //

/**
 * get Flickity.Cell, given an Element
 * @param {Element} elem
 * @returns {Flickity.Cell} item
 */
proto.getCell = function( elem ) {
  // loop through cells to get the one that matches
  for ( var i=0; i < this.cells.length; i++ ) {
    var cell = this.cells[i];
    if ( cell.element == elem ) {
      return cell;
    }
  }
};

/**
 * get collection of Flickity.Cells, given Elements
 * @param {Element, Array, NodeList} elems
 * @returns {Array} cells - Flickity.Cells
 */
proto.getCells = function( elems ) {
  elems = utils.makeArray( elems );
  var cells = [];
  elems.forEach( function( elem ) {
    var cell = this.getCell( elem );
    if ( cell ) {
      cells.push( cell );
    }
  }, this );
  return cells;
};

/**
 * get cell elements
 * @returns {Array} cellElems
 */
proto.getCellElements = function() {
  return this.cells.map( function( cell ) {
    return cell.element;
  });
};

/**
 * get parent cell from an element
 * @param {Element} elem
 * @returns {Flickit.Cell} cell
 */
proto.getParentCell = function( elem ) {
  // first check if elem is cell
  var cell = this.getCell( elem );
  if ( cell ) {
    return cell;
  }
  // try to get parent cell elem
  elem = utils.getParent( elem, '.flickity-slider > *' );
  return this.getCell( elem );
};

/**
 * get cells adjacent to a slide
 * @param {Integer} adjCount - number of adjacent slides
 * @param {Integer} index - index of slide to start
 * @returns {Array} cells - array of Flickity.Cells
 */
proto.getAdjacentCellElements = function( adjCount, index ) {
  if ( !adjCount ) {
    return this.selectedSlide.getCellElements();
  }
  index = index === undefined ? this.selectedIndex : index;

  var len = this.slides.length;
  if ( 1 + ( adjCount * 2 ) >= len ) {
    return this.getCellElements();
  }

  var cellElems = [];
  for ( var i = index - adjCount; i <= index + adjCount ; i++ ) {
    var slideIndex = this.options.wrapAround ? utils.modulo( i, len ) : i;
    var slide = this.slides[ slideIndex ];
    if ( slide ) {
      cellElems = cellElems.concat( slide.getCellElements() );
    }
  }
  return cellElems;
};

/**
 * select slide from number or cell element
 * @param {Element, Selector String, or Number} selector
 */
proto.queryCell = function( selector ) {
  if ( typeof selector == 'number' ) {
    // use number as index
    return this.cells[ selector ];
  }
  if ( typeof selector == 'string' ) {
    // do not select invalid selectors from hash: #123, #/. #791
    if ( selector.match(/^[#\.]?[\d\/]/) ) {
      return;
    }
    // use string as selector, get element
    selector = this.element.querySelector( selector );
  }
  // get cell from element
  return this.getCell( selector );
};

// -------------------------- events -------------------------- //

proto.uiChange = function() {
  this.emitEvent('uiChange');
};

// keep focus on element when child UI elements are clicked
proto.childUIPointerDown = function( event ) {
  // HACK iOS does not allow touch events to bubble up?!
  if ( event.type != 'touchstart' ) {
    event.preventDefault();
  }
  this.focus();
};

// ----- resize ----- //

proto.onresize = function() {
  this.watchCSS();
  this.resize();
};

utils.debounceMethod( Flickity, 'onresize', 150 );

proto.resize = function() {
  if ( !this.isActive ) {
    return;
  }
  this.getSize();
  // wrap values
  if ( this.options.wrapAround ) {
    this.x = utils.modulo( this.x, this.slideableWidth );
  }
  this.positionCells();
  this._getWrapShiftCells();
  this.setGallerySize();
  this.emitEvent('resize');
  // update selected index for group slides, instant
  // TODO: position can be lost between groups of various numbers
  var selectedElement = this.selectedElements && this.selectedElements[0];
  this.selectCell( selectedElement, false, true );
};

// watches the :after property, activates/deactivates
proto.watchCSS = function() {
  var watchOption = this.options.watchCSS;
  if ( !watchOption ) {
    return;
  }

  var afterContent = getComputedStyle( this.element, ':after' ).content;
  // activate if :after { content: 'flickity' }
  if ( afterContent.indexOf('flickity') != -1 ) {
    this.activate();
  } else {
    this.deactivate();
  }
};

// ----- keydown ----- //

// go previous/next if left/right keys pressed
proto.onkeydown = function( event ) {
  // only work if element is in focus
  var isNotFocused = document.activeElement && document.activeElement != this.element;
  if ( !this.options.accessibility ||isNotFocused ) {
    return;
  }

  var handler = Flickity.keyboardHandlers[ event.keyCode ];
  if ( handler ) {
    handler.call( this );
  }
};

Flickity.keyboardHandlers = {
  // left arrow
  37: function() {
    var leftMethod = this.options.rightToLeft ? 'next' : 'previous';
    this.uiChange();
    this[ leftMethod ]();
  },
  // right arrow
  39: function() {
    var rightMethod = this.options.rightToLeft ? 'previous' : 'next';
    this.uiChange();
    this[ rightMethod ]();
  },
};

// ----- focus ----- //

proto.focus = function() {
  // TODO remove scrollTo once focus options gets more support
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#Browser_compatibility
  var prevScrollY = window.pageYOffset;
  this.element.focus({ preventScroll: true });
  // hack to fix scroll jump after focus, #76
  if ( window.pageYOffset != prevScrollY ) {
    window.scrollTo( window.pageXOffset, prevScrollY );
  }
};

// -------------------------- destroy -------------------------- //

// deactivate all Flickity functionality, but keep stuff available
proto.deactivate = function() {
  if ( !this.isActive ) {
    return;
  }
  this.element.classList.remove('flickity-enabled');
  this.element.classList.remove('flickity-rtl');
  this.unselectSelectedSlide();
  // destroy cells
  this.cells.forEach( function( cell ) {
    cell.destroy();
  });
  this.element.removeChild( this.viewport );
  // move child elements back into element
  moveElements( this.slider.children, this.element );
  if ( this.options.accessibility ) {
    this.element.removeAttribute('tabIndex');
    this.element.removeEventListener( 'keydown', this );
  }
  // set flags
  this.isActive = false;
  this.emitEvent('deactivate');
};

proto.destroy = function() {
  this.deactivate();
  window.removeEventListener( 'resize', this );
  this.allOff();
  this.emitEvent('destroy');
  if ( jQuery && this.$element ) {
    jQuery.removeData( this.element, 'flickity' );
  }
  delete this.element.flickityGUID;
  delete instances[ this.guid ];
};

// -------------------------- prototype -------------------------- //

utils.extend( proto, animatePrototype );

// -------------------------- extras -------------------------- //

/**
 * get Flickity instance from element
 * @param {Element} elem
 * @returns {Flickity}
 */
Flickity.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.flickityGUID;
  return id && instances[ id ];
};

utils.htmlInit( Flickity, 'flickity' );

if ( jQuery && jQuery.bridget ) {
  jQuery.bridget( 'flickity', Flickity );
}

// set internal jQuery, for Webpack + jQuery v3, #478
Flickity.setJQuery = function( jq ) {
  jQuery = jq;
};

Flickity.Cell = Cell;
Flickity.Slide = Slide;

return Flickity;

}));


/***/ }),

/***/ 442:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Flickity v2.2.1
 * Touch, responsive, flickable carousels
 *
 * Licensed GPLv3 for open source use
 * or Flickity Commercial License for commercial use
 *
 * https://flickity.metafizzy.co
 * Copyright 2015-2019 Metafizzy
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(690),
      __webpack_require__(410),
      __webpack_require__(573),
      __webpack_require__(516),
      __webpack_require__(597),
      __webpack_require__(227)
    ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

})( window, function factory( Flickity ) {
  /*jshint strict: false*/
  return Flickity;
});


/***/ }),

/***/ 227:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// lazyload
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(47)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, utils ) {
      return factory( window, Flickity, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, utils ) {
'use strict';

Flickity.createMethods.push('_createLazyload');
var proto = Flickity.prototype;

proto._createLazyload = function() {
  this.on( 'select', this.lazyLoad );
};

proto.lazyLoad = function() {
  var lazyLoad = this.options.lazyLoad;
  if ( !lazyLoad ) {
    return;
  }
  // get adjacent cells, use lazyLoad option for adjacent count
  var adjCount = typeof lazyLoad == 'number' ? lazyLoad : 0;
  var cellElems = this.getAdjacentCellElements( adjCount );
  // get lazy images in those cells
  var lazyImages = [];
  cellElems.forEach( function( cellElem ) {
    var lazyCellImages = getCellLazyImages( cellElem );
    lazyImages = lazyImages.concat( lazyCellImages );
  });
  // load lazy images
  lazyImages.forEach( function( img ) {
    new LazyLoader( img, this );
  }, this );
};

function getCellLazyImages( cellElem ) {
  // check if cell element is lazy image
  if ( cellElem.nodeName == 'IMG' ) {
    var lazyloadAttr = cellElem.getAttribute('data-flickity-lazyload');
    var srcAttr = cellElem.getAttribute('data-flickity-lazyload-src');
    var srcsetAttr = cellElem.getAttribute('data-flickity-lazyload-srcset');
    if ( lazyloadAttr || srcAttr || srcsetAttr ) {
      return [ cellElem ];
    }
  }
  // select lazy images in cell
  var lazySelector = 'img[data-flickity-lazyload], ' +
    'img[data-flickity-lazyload-src], img[data-flickity-lazyload-srcset]';
  var imgs = cellElem.querySelectorAll( lazySelector );
  return utils.makeArray( imgs );
}

// -------------------------- LazyLoader -------------------------- //

/**
 * class to handle loading images
 */
function LazyLoader( img, flickity ) {
  this.img = img;
  this.flickity = flickity;
  this.load();
}

LazyLoader.prototype.handleEvent = utils.handleEvent;

LazyLoader.prototype.load = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  // get src & srcset
  var src = this.img.getAttribute('data-flickity-lazyload') ||
    this.img.getAttribute('data-flickity-lazyload-src');
  var srcset = this.img.getAttribute('data-flickity-lazyload-srcset');
  // set src & serset
  this.img.src = src;
  if ( srcset ) {
    this.img.setAttribute( 'srcset', srcset );
  }
  // remove attr
  this.img.removeAttribute('data-flickity-lazyload');
  this.img.removeAttribute('data-flickity-lazyload-src');
  this.img.removeAttribute('data-flickity-lazyload-srcset');
};

LazyLoader.prototype.onload = function( event ) {
  this.complete( event, 'flickity-lazyloaded' );
};

LazyLoader.prototype.onerror = function( event ) {
  this.complete( event, 'flickity-lazyerror' );
};

LazyLoader.prototype.complete = function( event, className ) {
  // unbind events
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );

  var cell = this.flickity.getParentCell( this.img );
  var cellElem = cell && cell.element;
  this.flickity.cellSizeChange( cellElem );

  this.img.classList.add( className );
  this.flickity.dispatchEvent( 'lazyLoad', event, cellElem );
};

// -----  ----- //

Flickity.LazyLoader = LazyLoader;

return Flickity;

}));


/***/ }),

/***/ 573:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// page dots
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(704),
      __webpack_require__(47)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, Unipointer, utils ) {
      return factory( window, Flickity, Unipointer, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, Unipointer, utils ) {

// -------------------------- PageDots -------------------------- //

'use strict';

function PageDots( parent ) {
  this.parent = parent;
  this._create();
}

PageDots.prototype = Object.create( Unipointer.prototype );

PageDots.prototype._create = function() {
  // create holder element
  this.holder = document.createElement('ol');
  this.holder.className = 'flickity-page-dots';
  // create dots, array of elements
  this.dots = [];
  // events
  this.handleClick = this.onClick.bind( this );
  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
};

PageDots.prototype.activate = function() {
  this.setDots();
  this.holder.addEventListener( 'click', this.handleClick );
  this.bindStartEvent( this.holder );
  // add to DOM
  this.parent.element.appendChild( this.holder );
};

PageDots.prototype.deactivate = function() {
  this.holder.removeEventListener( 'click', this.handleClick );
  this.unbindStartEvent( this.holder );
  // remove from DOM
  this.parent.element.removeChild( this.holder );
};

PageDots.prototype.setDots = function() {
  // get difference between number of slides and number of dots
  var delta = this.parent.slides.length - this.dots.length;
  if ( delta > 0 ) {
    this.addDots( delta );
  } else if ( delta < 0 ) {
    this.removeDots( -delta );
  }
};

PageDots.prototype.addDots = function( count ) {
  var fragment = document.createDocumentFragment();
  var newDots = [];
  var length = this.dots.length;
  var max = length + count;

  for ( var i = length; i < max; i++ ) {
    var dot = document.createElement('li');
    dot.className = 'dot';
    dot.setAttribute( 'aria-label', 'Page dot ' + ( i + 1 ) );
    fragment.appendChild( dot );
    newDots.push( dot );
  }

  this.holder.appendChild( fragment );
  this.dots = this.dots.concat( newDots );
};

PageDots.prototype.removeDots = function( count ) {
  // remove from this.dots collection
  var removeDots = this.dots.splice( this.dots.length - count, count );
  // remove from DOM
  removeDots.forEach( function( dot ) {
    this.holder.removeChild( dot );
  }, this );
};

PageDots.prototype.updateSelected = function() {
  // remove selected class on previous
  if ( this.selectedDot ) {
    this.selectedDot.className = 'dot';
    this.selectedDot.removeAttribute('aria-current');
  }
  // don't proceed if no dots
  if ( !this.dots.length ) {
    return;
  }
  this.selectedDot = this.dots[ this.parent.selectedIndex ];
  this.selectedDot.className = 'dot is-selected';
  this.selectedDot.setAttribute( 'aria-current', 'step' );
};

PageDots.prototype.onTap = // old method name, backwards-compatible
PageDots.prototype.onClick = function( event ) {
  var target = event.target;
  // only care about dot clicks
  if ( target.nodeName != 'LI' ) {
    return;
  }

  this.parent.uiChange();
  var index = this.dots.indexOf( target );
  this.parent.select( index );
};

PageDots.prototype.destroy = function() {
  this.deactivate();
  this.allOff();
};

Flickity.PageDots = PageDots;

// -------------------------- Flickity -------------------------- //

utils.extend( Flickity.defaults, {
  pageDots: true
});

Flickity.createMethods.push('_createPageDots');

var proto = Flickity.prototype;

proto._createPageDots = function() {
  if ( !this.options.pageDots ) {
    return;
  }
  this.pageDots = new PageDots( this );
  // events
  this.on( 'activate', this.activatePageDots );
  this.on( 'select', this.updateSelectedPageDots );
  this.on( 'cellChange', this.updatePageDots );
  this.on( 'resize', this.updatePageDots );
  this.on( 'deactivate', this.deactivatePageDots );
};

proto.activatePageDots = function() {
  this.pageDots.activate();
};

proto.updateSelectedPageDots = function() {
  this.pageDots.updateSelected();
};

proto.updatePageDots = function() {
  this.pageDots.setDots();
};

proto.deactivatePageDots = function() {
  this.pageDots.deactivate();
};

// -----  ----- //

Flickity.PageDots = PageDots;

return Flickity;

}));


/***/ }),

/***/ 516:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// player & autoPlay
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(158),
      __webpack_require__(47),
      __webpack_require__(217)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( EvEmitter, utils, Flickity ) {
      return factory( EvEmitter, utils, Flickity );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( EvEmitter, utils, Flickity ) {

'use strict';

// -------------------------- Player -------------------------- //

function Player( parent ) {
  this.parent = parent;
  this.state = 'stopped';
  // visibility change event handler
  this.onVisibilityChange = this.visibilityChange.bind( this );
  this.onVisibilityPlay = this.visibilityPlay.bind( this );
}

Player.prototype = Object.create( EvEmitter.prototype );

// start play
Player.prototype.play = function() {
  if ( this.state == 'playing' ) {
    return;
  }
  // do not play if page is hidden, start playing when page is visible
  var isPageHidden = document.hidden;
  if ( isPageHidden ) {
    document.addEventListener( 'visibilitychange', this.onVisibilityPlay );
    return;
  }

  this.state = 'playing';
  // listen to visibility change
  document.addEventListener( 'visibilitychange', this.onVisibilityChange );
  // start ticking
  this.tick();
};

Player.prototype.tick = function() {
  // do not tick if not playing
  if ( this.state != 'playing' ) {
    return;
  }

  var time = this.parent.options.autoPlay;
  // default to 3 seconds
  time = typeof time == 'number' ? time : 3000;
  var _this = this;
  // HACK: reset ticks if stopped and started within interval
  this.clear();
  this.timeout = setTimeout( function() {
    _this.parent.next( true );
    _this.tick();
  }, time );
};

Player.prototype.stop = function() {
  this.state = 'stopped';
  this.clear();
  // remove visibility change event
  document.removeEventListener( 'visibilitychange', this.onVisibilityChange );
};

Player.prototype.clear = function() {
  clearTimeout( this.timeout );
};

Player.prototype.pause = function() {
  if ( this.state == 'playing' ) {
    this.state = 'paused';
    this.clear();
  }
};

Player.prototype.unpause = function() {
  // re-start play if paused
  if ( this.state == 'paused' ) {
    this.play();
  }
};

// pause if page visibility is hidden, unpause if visible
Player.prototype.visibilityChange = function() {
  var isPageHidden = document.hidden;
  this[ isPageHidden ? 'pause' : 'unpause' ]();
};

Player.prototype.visibilityPlay = function() {
  this.play();
  document.removeEventListener( 'visibilitychange', this.onVisibilityPlay );
};

// -------------------------- Flickity -------------------------- //

utils.extend( Flickity.defaults, {
  pauseAutoPlayOnHover: true
});

Flickity.createMethods.push('_createPlayer');
var proto = Flickity.prototype;

proto._createPlayer = function() {
  this.player = new Player( this );

  this.on( 'activate', this.activatePlayer );
  this.on( 'uiChange', this.stopPlayer );
  this.on( 'pointerDown', this.stopPlayer );
  this.on( 'deactivate', this.deactivatePlayer );
};

proto.activatePlayer = function() {
  if ( !this.options.autoPlay ) {
    return;
  }
  this.player.play();
  this.element.addEventListener( 'mouseenter', this );
};

// Player API, don't hate the ... thanks I know where the door is

proto.playPlayer = function() {
  this.player.play();
};

proto.stopPlayer = function() {
  this.player.stop();
};

proto.pausePlayer = function() {
  this.player.pause();
};

proto.unpausePlayer = function() {
  this.player.unpause();
};

proto.deactivatePlayer = function() {
  this.player.stop();
  this.element.removeEventListener( 'mouseenter', this );
};

// ----- mouseenter/leave ----- //

// pause auto-play on hover
proto.onmouseenter = function() {
  if ( !this.options.pauseAutoPlayOnHover ) {
    return;
  }
  this.player.pause();
  this.element.addEventListener( 'mouseleave', this );
};

// resume auto-play on hover off
proto.onmouseleave = function() {
  this.player.unpause();
  this.element.removeEventListener( 'mouseleave', this );
};

// -----  ----- //

Flickity.Player = Player;

return Flickity;

}));


/***/ }),

/***/ 410:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// prev/next buttons
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(217),
      __webpack_require__(704),
      __webpack_require__(47)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Flickity, Unipointer, utils ) {
      return factory( window, Flickity, Unipointer, utils );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Flickity, Unipointer, utils ) {
'use strict';

var svgURI = 'http://www.w3.org/2000/svg';

// -------------------------- PrevNextButton -------------------------- //

function PrevNextButton( direction, parent ) {
  this.direction = direction;
  this.parent = parent;
  this._create();
}

PrevNextButton.prototype = Object.create( Unipointer.prototype );

PrevNextButton.prototype._create = function() {
  // properties
  this.isEnabled = true;
  this.isPrevious = this.direction == -1;
  var leftDirection = this.parent.options.rightToLeft ? 1 : -1;
  this.isLeft = this.direction == leftDirection;

  var element = this.element = document.createElement('button');
  element.className = 'flickity-button flickity-prev-next-button';
  element.className += this.isPrevious ? ' previous' : ' next';
  // prevent button from submitting form http://stackoverflow.com/a/10836076/182183
  element.setAttribute( 'type', 'button' );
  // init as disabled
  this.disable();

  element.setAttribute( 'aria-label', this.isPrevious ? 'Previous' : 'Next' );

  // create arrow
  var svg = this.createSVG();
  element.appendChild( svg );
  // events
  this.parent.on( 'select', this.update.bind( this ) );
  this.on( 'pointerDown', this.parent.childUIPointerDown.bind( this.parent ) );
};

PrevNextButton.prototype.activate = function() {
  this.bindStartEvent( this.element );
  this.element.addEventListener( 'click', this );
  // add to DOM
  this.parent.element.appendChild( this.element );
};

PrevNextButton.prototype.deactivate = function() {
  // remove from DOM
  this.parent.element.removeChild( this.element );
  // click events
  this.unbindStartEvent( this.element );
  this.element.removeEventListener( 'click', this );
};

PrevNextButton.prototype.createSVG = function() {
  var svg = document.createElementNS( svgURI, 'svg');
  svg.setAttribute( 'class', 'flickity-button-icon' );
  svg.setAttribute( 'viewBox', '0 0 100 100' );
  var path = document.createElementNS( svgURI, 'path');
  var pathMovements = getArrowMovements( this.parent.options.arrowShape );
  path.setAttribute( 'd', pathMovements );
  path.setAttribute( 'class', 'arrow' );
  // rotate arrow
  if ( !this.isLeft ) {
    path.setAttribute( 'transform', 'translate(100, 100) rotate(180) ' );
  }
  svg.appendChild( path );
  return svg;
};

// get SVG path movmement
function getArrowMovements( shape ) {
  // use shape as movement if string
  if ( typeof shape == 'string' ) {
    return shape;
  }
  // create movement string
  return 'M ' + shape.x0 + ',50' +
    ' L ' + shape.x1 + ',' + ( shape.y1 + 50 ) +
    ' L ' + shape.x2 + ',' + ( shape.y2 + 50 ) +
    ' L ' + shape.x3 + ',50 ' +
    ' L ' + shape.x2 + ',' + ( 50 - shape.y2 ) +
    ' L ' + shape.x1 + ',' + ( 50 - shape.y1 ) +
    ' Z';
}

PrevNextButton.prototype.handleEvent = utils.handleEvent;

PrevNextButton.prototype.onclick = function() {
  if ( !this.isEnabled ) {
    return;
  }
  this.parent.uiChange();
  var method = this.isPrevious ? 'previous' : 'next';
  this.parent[ method ]();
};

// -----  ----- //

PrevNextButton.prototype.enable = function() {
  if ( this.isEnabled ) {
    return;
  }
  this.element.disabled = false;
  this.isEnabled = true;
};

PrevNextButton.prototype.disable = function() {
  if ( !this.isEnabled ) {
    return;
  }
  this.element.disabled = true;
  this.isEnabled = false;
};

PrevNextButton.prototype.update = function() {
  // index of first or last slide, if previous or next
  var slides = this.parent.slides;
  // enable is wrapAround and at least 2 slides
  if ( this.parent.options.wrapAround && slides.length > 1 ) {
    this.enable();
    return;
  }
  var lastIndex = slides.length ? slides.length - 1 : 0;
  var boundIndex = this.isPrevious ? 0 : lastIndex;
  var method = this.parent.selectedIndex == boundIndex ? 'disable' : 'enable';
  this[ method ]();
};

PrevNextButton.prototype.destroy = function() {
  this.deactivate();
  this.allOff();
};

// -------------------------- Flickity prototype -------------------------- //

utils.extend( Flickity.defaults, {
  prevNextButtons: true,
  arrowShape: {
    x0: 10,
    x1: 60, y1: 50,
    x2: 70, y2: 40,
    x3: 30
  }
});

Flickity.createMethods.push('_createPrevNextButtons');
var proto = Flickity.prototype;

proto._createPrevNextButtons = function() {
  if ( !this.options.prevNextButtons ) {
    return;
  }

  this.prevButton = new PrevNextButton( -1, this );
  this.nextButton = new PrevNextButton( 1, this );

  this.on( 'activate', this.activatePrevNextButtons );
};

proto.activatePrevNextButtons = function() {
  this.prevButton.activate();
  this.nextButton.activate();
  this.on( 'deactivate', this.deactivatePrevNextButtons );
};

proto.deactivatePrevNextButtons = function() {
  this.prevButton.deactivate();
  this.nextButton.deactivate();
  this.off( 'deactivate', this.deactivatePrevNextButtons );
};

// --------------------------  -------------------------- //

Flickity.PrevNextButton = PrevNextButton;

return Flickity;

}));


/***/ }),

/***/ 714:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;// slide
( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory() {
'use strict';

function Slide( parent ) {
  this.parent = parent;
  this.isOriginLeft = parent.originSide == 'left';
  this.cells = [];
  this.outerWidth = 0;
  this.height = 0;
}

var proto = Slide.prototype;

proto.addCell = function( cell ) {
  this.cells.push( cell );
  this.outerWidth += cell.size.outerWidth;
  this.height = Math.max( cell.size.outerHeight, this.height );
  // first cell stuff
  if ( this.cells.length == 1 ) {
    this.x = cell.x; // x comes from first cell
    var beginMargin = this.isOriginLeft ? 'marginLeft' : 'marginRight';
    this.firstMargin = cell.size[ beginMargin ];
  }
};

proto.updateTarget = function() {
  var endMargin = this.isOriginLeft ? 'marginRight' : 'marginLeft';
  var lastCell = this.getLastCell();
  var lastMargin = lastCell ? lastCell.size[ endMargin ] : 0;
  var slideWidth = this.outerWidth - ( this.firstMargin + lastMargin );
  this.target = this.x + this.firstMargin + slideWidth * this.parent.cellAlign;
};

proto.getLastCell = function() {
  return this.cells[ this.cells.length - 1 ];
};

proto.select = function() {
  this.cells.forEach( function( cell ) {
    cell.select();
  });
};

proto.unselect = function() {
  this.cells.forEach( function( cell ) {
    cell.unselect();
  });
};

proto.getCellElements = function() {
  return this.cells.map( function( cell ) {
    return cell.element;
  });
};

return Slide;

}));


/***/ }),

/***/ 131:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */

/* jshint browser: true, strict: true, undef: true, unused: true */
/* globals console: false */

( function( window, factory ) {
  /* jshint strict: false */ /* globals define, module */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

})( window, function factory() {
'use strict';

// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') == -1 && !isNaN( num );
  return isValid && num;
}

function noop() {}

var logError = typeof console == 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

var measurementsLength = measurements.length;

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}

// -------------------------- getStyle -------------------------- //

/**
 * getStyle, get style of element, check for Firefox bug
 * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function getStyle( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    logError( 'Style returned ' + style +
      '. Are you running this code in a hidden iframe on Firefox? ' +
      'See https://bit.ly/getsizebug1' );
  }
  return style;
}

// -------------------------- setup -------------------------- //

var isSetup = false;

var isBoxSizeOuter;

/**
 * setup
 * check isBoxSizerOuter
 * do on first getSize() rather than on page load for Firefox bug
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  // -------------------------- box sizing -------------------------- //

  /**
   * Chrome & Safari measure the outer-width on style.width on border-box elems
   * IE11 & Firefox<29 measures the inner-width
   */
  var div = document.createElement('div');
  div.style.width = '200px';
  div.style.padding = '1px 2px 3px 4px';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px 2px 3px 4px';
  div.style.boxSizing = 'border-box';

  var body = document.body || document.documentElement;
  body.appendChild( div );
  var style = getStyle( div );
  // round value for browser zoom. desandro/masonry#928
  isBoxSizeOuter = Math.round( getStyleSize( style.width ) ) == 200;
  getSize.isBoxSizeOuter = isBoxSizeOuter;

  body.removeChild( div );
}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem == 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem != 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display == 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

  // get all measurements
  for ( var i=0; i < measurementsLength; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

return getSize;

});


/***/ }),

/***/ 337:
/***/ (function() {

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */

(function(window, document) {
'use strict';


// Exits early if all IntersectionObserver and IntersectionObserverEntry
// features are natively supported.
if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {

  // Minimal polyfill for Edge 15's lack of `isIntersecting`
  // See: https://github.com/w3c/IntersectionObserver/issues/211
  if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
    Object.defineProperty(window.IntersectionObserverEntry.prototype,
      'isIntersecting', {
      get: function () {
        return this.intersectionRatio > 0;
      }
    });
  }
  return;
}


/**
 * An IntersectionObserver registry. This registry exists to hold a strong
 * reference to IntersectionObserver instances currently observing a target
 * element. Without this registry, instances without another reference may be
 * garbage collected.
 */
var registry = [];


/**
 * Creates the global IntersectionObserverEntry constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
 * @param {Object} entry A dictionary of instance properties.
 * @constructor
 */
function IntersectionObserverEntry(entry) {
  this.time = entry.time;
  this.target = entry.target;
  this.rootBounds = entry.rootBounds;
  this.boundingClientRect = entry.boundingClientRect;
  this.intersectionRect = entry.intersectionRect || getEmptyRect();
  this.isIntersecting = !!entry.intersectionRect;

  // Calculates the intersection ratio.
  var targetRect = this.boundingClientRect;
  var targetArea = targetRect.width * targetRect.height;
  var intersectionRect = this.intersectionRect;
  var intersectionArea = intersectionRect.width * intersectionRect.height;

  // Sets intersection ratio.
  if (targetArea) {
    // Round the intersection ratio to avoid floating point math issues:
    // https://github.com/w3c/IntersectionObserver/issues/324
    this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
  } else {
    // If area is zero and is intersecting, sets to 1, otherwise to 0
    this.intersectionRatio = this.isIntersecting ? 1 : 0;
  }
}


/**
 * Creates the global IntersectionObserver constructor.
 * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
 * @param {Function} callback The function to be invoked after intersection
 *     changes have queued. The function is not invoked if the queue has
 *     been emptied by calling the `takeRecords` method.
 * @param {Object=} opt_options Optional configuration options.
 * @constructor
 */
function IntersectionObserver(callback, opt_options) {

  var options = opt_options || {};

  if (typeof callback != 'function') {
    throw new Error('callback must be a function');
  }

  if (options.root && options.root.nodeType != 1) {
    throw new Error('root must be an Element');
  }

  // Binds and throttles `this._checkForIntersections`.
  this._checkForIntersections = throttle(
      this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);

  // Private properties.
  this._callback = callback;
  this._observationTargets = [];
  this._queuedEntries = [];
  this._rootMarginValues = this._parseRootMargin(options.rootMargin);

  // Public properties.
  this.thresholds = this._initThresholds(options.threshold);
  this.root = options.root || null;
  this.rootMargin = this._rootMarginValues.map(function(margin) {
    return margin.value + margin.unit;
  }).join(' ');
}


/**
 * The minimum interval within which the document will be checked for
 * intersection changes.
 */
IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;


/**
 * The frequency in which the polyfill polls for intersection changes.
 * this can be updated on a per instance basis and must be set prior to
 * calling `observe` on the first target.
 */
IntersectionObserver.prototype.POLL_INTERVAL = null;

/**
 * Use a mutation observer on the root element
 * to detect intersection changes.
 */
IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;


/**
 * Starts observing a target element for intersection changes based on
 * the thresholds values.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.observe = function(target) {
  var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
    return item.element == target;
  });

  if (isTargetAlreadyObserved) {
    return;
  }

  if (!(target && target.nodeType == 1)) {
    throw new Error('target must be an Element');
  }

  this._registerInstance();
  this._observationTargets.push({element: target, entry: null});
  this._monitorIntersections();
  this._checkForIntersections();
};


/**
 * Stops observing a target element for intersection changes.
 * @param {Element} target The DOM element to observe.
 */
IntersectionObserver.prototype.unobserve = function(target) {
  this._observationTargets =
      this._observationTargets.filter(function(item) {

    return item.element != target;
  });
  if (!this._observationTargets.length) {
    this._unmonitorIntersections();
    this._unregisterInstance();
  }
};


/**
 * Stops observing all target elements for intersection changes.
 */
IntersectionObserver.prototype.disconnect = function() {
  this._observationTargets = [];
  this._unmonitorIntersections();
  this._unregisterInstance();
};


/**
 * Returns any queue entries that have not yet been reported to the
 * callback and clears the queue. This can be used in conjunction with the
 * callback to obtain the absolute most up-to-date intersection information.
 * @return {Array} The currently queued entries.
 */
IntersectionObserver.prototype.takeRecords = function() {
  var records = this._queuedEntries.slice();
  this._queuedEntries = [];
  return records;
};


/**
 * Accepts the threshold value from the user configuration object and
 * returns a sorted array of unique threshold values. If a value is not
 * between 0 and 1 and error is thrown.
 * @private
 * @param {Array|number=} opt_threshold An optional threshold value or
 *     a list of threshold values, defaulting to [0].
 * @return {Array} A sorted list of unique and valid threshold values.
 */
IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
  var threshold = opt_threshold || [0];
  if (!Array.isArray(threshold)) threshold = [threshold];

  return threshold.sort().filter(function(t, i, a) {
    if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
      throw new Error('threshold must be a number between 0 and 1 inclusively');
    }
    return t !== a[i - 1];
  });
};


/**
 * Accepts the rootMargin value from the user configuration object
 * and returns an array of the four margin values as an object containing
 * the value and unit properties. If any of the values are not properly
 * formatted or use a unit other than px or %, and error is thrown.
 * @private
 * @param {string=} opt_rootMargin An optional rootMargin value,
 *     defaulting to '0px'.
 * @return {Array<Object>} An array of margin objects with the keys
 *     value and unit.
 */
IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
  var marginString = opt_rootMargin || '0px';
  var margins = marginString.split(/\s+/).map(function(margin) {
    var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
    if (!parts) {
      throw new Error('rootMargin must be specified in pixels or percent');
    }
    return {value: parseFloat(parts[1]), unit: parts[2]};
  });

  // Handles shorthand.
  margins[1] = margins[1] || margins[0];
  margins[2] = margins[2] || margins[0];
  margins[3] = margins[3] || margins[1];

  return margins;
};


/**
 * Starts polling for intersection changes if the polling is not already
 * happening, and if the page's visibility state is visible.
 * @private
 */
IntersectionObserver.prototype._monitorIntersections = function() {
  if (!this._monitoringIntersections) {
    this._monitoringIntersections = true;

    // If a poll interval is set, use polling instead of listening to
    // resize and scroll events or DOM mutations.
    if (this.POLL_INTERVAL) {
      this._monitoringInterval = setInterval(
          this._checkForIntersections, this.POLL_INTERVAL);
    }
    else {
      addEvent(window, 'resize', this._checkForIntersections, true);
      addEvent(document, 'scroll', this._checkForIntersections, true);

      if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in window) {
        this._domObserver = new MutationObserver(this._checkForIntersections);
        this._domObserver.observe(document, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    }
  }
};


/**
 * Stops polling for intersection changes.
 * @private
 */
IntersectionObserver.prototype._unmonitorIntersections = function() {
  if (this._monitoringIntersections) {
    this._monitoringIntersections = false;

    clearInterval(this._monitoringInterval);
    this._monitoringInterval = null;

    removeEvent(window, 'resize', this._checkForIntersections, true);
    removeEvent(document, 'scroll', this._checkForIntersections, true);

    if (this._domObserver) {
      this._domObserver.disconnect();
      this._domObserver = null;
    }
  }
};


/**
 * Scans each observation target for intersection changes and adds them
 * to the internal entries queue. If new entries are found, it
 * schedules the callback to be invoked.
 * @private
 */
IntersectionObserver.prototype._checkForIntersections = function() {
  var rootIsInDom = this._rootIsInDom();
  var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

  this._observationTargets.forEach(function(item) {
    var target = item.element;
    var targetRect = getBoundingClientRect(target);
    var rootContainsTarget = this._rootContainsTarget(target);
    var oldEntry = item.entry;
    var intersectionRect = rootIsInDom && rootContainsTarget &&
        this._computeTargetAndRootIntersection(target, rootRect);

    var newEntry = item.entry = new IntersectionObserverEntry({
      time: now(),
      target: target,
      boundingClientRect: targetRect,
      rootBounds: rootRect,
      intersectionRect: intersectionRect
    });

    if (!oldEntry) {
      this._queuedEntries.push(newEntry);
    } else if (rootIsInDom && rootContainsTarget) {
      // If the new entry intersection ratio has crossed any of the
      // thresholds, add a new entry.
      if (this._hasCrossedThreshold(oldEntry, newEntry)) {
        this._queuedEntries.push(newEntry);
      }
    } else {
      // If the root is not in the DOM or target is not contained within
      // root but the previous entry for this target had an intersection,
      // add a new record indicating removal.
      if (oldEntry && oldEntry.isIntersecting) {
        this._queuedEntries.push(newEntry);
      }
    }
  }, this);

  if (this._queuedEntries.length) {
    this._callback(this.takeRecords(), this);
  }
};


/**
 * Accepts a target and root rect computes the intersection between then
 * following the algorithm in the spec.
 * TODO(philipwalton): at this time clip-path is not considered.
 * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
 * @param {Element} target The target DOM element
 * @param {Object} rootRect The bounding rect of the root after being
 *     expanded by the rootMargin value.
 * @return {?Object} The final intersection rect object or undefined if no
 *     intersection is found.
 * @private
 */
IntersectionObserver.prototype._computeTargetAndRootIntersection =
    function(target, rootRect) {

  // If the element isn't displayed, an intersection can't happen.
  if (window.getComputedStyle(target).display == 'none') return;

  var targetRect = getBoundingClientRect(target);
  var intersectionRect = targetRect;
  var parent = getParentNode(target);
  var atRoot = false;

  while (!atRoot) {
    var parentRect = null;
    var parentComputedStyle = parent.nodeType == 1 ?
        window.getComputedStyle(parent) : {};

    // If the parent isn't displayed, an intersection can't happen.
    if (parentComputedStyle.display == 'none') return;

    if (parent == this.root || parent == document) {
      atRoot = true;
      parentRect = rootRect;
    } else {
      // If the element has a non-visible overflow, and it's not the <body>
      // or <html> element, update the intersection rect.
      // Note: <body> and <html> cannot be clipped to a rect that's not also
      // the document rect, so no need to compute a new intersection.
      if (parent != document.body &&
          parent != document.documentElement &&
          parentComputedStyle.overflow != 'visible') {
        parentRect = getBoundingClientRect(parent);
      }
    }

    // If either of the above conditionals set a new parentRect,
    // calculate new intersection data.
    if (parentRect) {
      intersectionRect = computeRectIntersection(parentRect, intersectionRect);

      if (!intersectionRect) break;
    }
    parent = getParentNode(parent);
  }
  return intersectionRect;
};


/**
 * Returns the root rect after being expanded by the rootMargin value.
 * @return {Object} The expanded root rect.
 * @private
 */
IntersectionObserver.prototype._getRootRect = function() {
  var rootRect;
  if (this.root) {
    rootRect = getBoundingClientRect(this.root);
  } else {
    // Use <html>/<body> instead of window since scroll bars affect size.
    var html = document.documentElement;
    var body = document.body;
    rootRect = {
      top: 0,
      left: 0,
      right: html.clientWidth || body.clientWidth,
      width: html.clientWidth || body.clientWidth,
      bottom: html.clientHeight || body.clientHeight,
      height: html.clientHeight || body.clientHeight
    };
  }
  return this._expandRectByRootMargin(rootRect);
};


/**
 * Accepts a rect and expands it by the rootMargin value.
 * @param {Object} rect The rect object to expand.
 * @return {Object} The expanded rect.
 * @private
 */
IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
  var margins = this._rootMarginValues.map(function(margin, i) {
    return margin.unit == 'px' ? margin.value :
        margin.value * (i % 2 ? rect.width : rect.height) / 100;
  });
  var newRect = {
    top: rect.top - margins[0],
    right: rect.right + margins[1],
    bottom: rect.bottom + margins[2],
    left: rect.left - margins[3]
  };
  newRect.width = newRect.right - newRect.left;
  newRect.height = newRect.bottom - newRect.top;

  return newRect;
};


/**
 * Accepts an old and new entry and returns true if at least one of the
 * threshold values has been crossed.
 * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
 *    particular target element or null if no previous entry exists.
 * @param {IntersectionObserverEntry} newEntry The current entry for a
 *    particular target element.
 * @return {boolean} Returns true if a any threshold has been crossed.
 * @private
 */
IntersectionObserver.prototype._hasCrossedThreshold =
    function(oldEntry, newEntry) {

  // To make comparing easier, an entry that has a ratio of 0
  // but does not actually intersect is given a value of -1
  var oldRatio = oldEntry && oldEntry.isIntersecting ?
      oldEntry.intersectionRatio || 0 : -1;
  var newRatio = newEntry.isIntersecting ?
      newEntry.intersectionRatio || 0 : -1;

  // Ignore unchanged ratios
  if (oldRatio === newRatio) return;

  for (var i = 0; i < this.thresholds.length; i++) {
    var threshold = this.thresholds[i];

    // Return true if an entry matches a threshold or if the new ratio
    // and the old ratio are on the opposite sides of a threshold.
    if (threshold == oldRatio || threshold == newRatio ||
        threshold < oldRatio !== threshold < newRatio) {
      return true;
    }
  }
};


/**
 * Returns whether or not the root element is an element and is in the DOM.
 * @return {boolean} True if the root element is an element and is in the DOM.
 * @private
 */
IntersectionObserver.prototype._rootIsInDom = function() {
  return !this.root || containsDeep(document, this.root);
};


/**
 * Returns whether or not the target element is a child of root.
 * @param {Element} target The target element to check.
 * @return {boolean} True if the target element is a child of root.
 * @private
 */
IntersectionObserver.prototype._rootContainsTarget = function(target) {
  return containsDeep(this.root || document, target);
};


/**
 * Adds the instance to the global IntersectionObserver registry if it isn't
 * already present.
 * @private
 */
IntersectionObserver.prototype._registerInstance = function() {
  if (registry.indexOf(this) < 0) {
    registry.push(this);
  }
};


/**
 * Removes the instance from the global IntersectionObserver registry.
 * @private
 */
IntersectionObserver.prototype._unregisterInstance = function() {
  var index = registry.indexOf(this);
  if (index != -1) registry.splice(index, 1);
};


/**
 * Returns the result of the performance.now() method or null in browsers
 * that don't support the API.
 * @return {number} The elapsed time since the page was requested.
 */
function now() {
  return window.performance && performance.now && performance.now();
}


/**
 * Throttles a function and delays its execution, so it's only called at most
 * once within a given time period.
 * @param {Function} fn The function to throttle.
 * @param {number} timeout The amount of time that must pass before the
 *     function can be called again.
 * @return {Function} The throttled function.
 */
function throttle(fn, timeout) {
  var timer = null;
  return function () {
    if (!timer) {
      timer = setTimeout(function() {
        fn();
        timer = null;
      }, timeout);
    }
  };
}


/**
 * Adds an event handler to a DOM node ensuring cross-browser compatibility.
 * @param {Node} node The DOM node to add the event handler to.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to add.
 * @param {boolean} opt_useCapture Optionally adds the even to the capture
 *     phase. Note: this only works in modern browsers.
 */
function addEvent(node, event, fn, opt_useCapture) {
  if (typeof node.addEventListener == 'function') {
    node.addEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.attachEvent == 'function') {
    node.attachEvent('on' + event, fn);
  }
}


/**
 * Removes a previously added event handler from a DOM node.
 * @param {Node} node The DOM node to remove the event handler from.
 * @param {string} event The event name.
 * @param {Function} fn The event handler to remove.
 * @param {boolean} opt_useCapture If the event handler was added with this
 *     flag set to true, it should be set to true here in order to remove it.
 */
function removeEvent(node, event, fn, opt_useCapture) {
  if (typeof node.removeEventListener == 'function') {
    node.removeEventListener(event, fn, opt_useCapture || false);
  }
  else if (typeof node.detatchEvent == 'function') {
    node.detatchEvent('on' + event, fn);
  }
}


/**
 * Returns the intersection between two rect objects.
 * @param {Object} rect1 The first rect.
 * @param {Object} rect2 The second rect.
 * @return {?Object} The intersection rect or undefined if no intersection
 *     is found.
 */
function computeRectIntersection(rect1, rect2) {
  var top = Math.max(rect1.top, rect2.top);
  var bottom = Math.min(rect1.bottom, rect2.bottom);
  var left = Math.max(rect1.left, rect2.left);
  var right = Math.min(rect1.right, rect2.right);
  var width = right - left;
  var height = bottom - top;

  return (width >= 0 && height >= 0) && {
    top: top,
    bottom: bottom,
    left: left,
    right: right,
    width: width,
    height: height
  };
}


/**
 * Shims the native getBoundingClientRect for compatibility with older IE.
 * @param {Element} el The element whose bounding rect to get.
 * @return {Object} The (possibly shimmed) rect of the element.
 */
function getBoundingClientRect(el) {
  var rect;

  try {
    rect = el.getBoundingClientRect();
  } catch (err) {
    // Ignore Windows 7 IE11 "Unspecified error"
    // https://github.com/w3c/IntersectionObserver/pull/205
  }

  if (!rect) return getEmptyRect();

  // Older IE
  if (!(rect.width && rect.height)) {
    rect = {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };
  }
  return rect;
}


/**
 * Returns an empty rect object. An empty rect is returned when an element
 * is not in the DOM.
 * @return {Object} The empty rect.
 */
function getEmptyRect() {
  return {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0
  };
}

/**
 * Checks to see if a parent element contains a child element (including inside
 * shadow DOM).
 * @param {Node} parent The parent element.
 * @param {Node} child The child element.
 * @return {boolean} True if the parent node contains the child node.
 */
function containsDeep(parent, child) {
  var node = child;
  while (node) {
    if (node == parent) return true;

    node = getParentNode(node);
  }
  return false;
}


/**
 * Gets the parent node of an element or its host element if the parent node
 * is a shadow root.
 * @param {Node} node The node whose parent to get.
 * @return {Node|null} The parent node or null if no parent exists.
 */
function getParentNode(node) {
  var parent = node.parentNode;

  if (parent && parent.nodeType == 11 && parent.host) {
    // If the parent is a shadow root, return the host element.
    return parent.host;
  }
  return parent;
}


// Exposes the constructors globally.
window.IntersectionObserver = IntersectionObserver;
window.IntersectionObserverEntry = IntersectionObserverEntry;

}(window, document));


/***/ }),

/***/ 751:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Masonry v4.2.2
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(794),
        __webpack_require__(131)
      ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( Outlayer, getSize ) {

'use strict';

// -------------------------- masonryDefinition -------------------------- //

  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');
  // isFitWidth -> fitWidth
  Masonry.compatOptions.fitWidth = 'isFitWidth';

  var proto = Masonry.prototype;

  proto._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    this.colYs = [];
    for ( var i=0; i < this.cols; i++ ) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
    this.horizontalColIndex = 0;
  };

  proto.measureColumns = function() {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if ( !this.columnWidth ) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    var columnWidth = this.columnWidth += this.gutter;

    // calculate columns
    var containerWidth = this.containerWidth + this.gutter;
    var cols = containerWidth / columnWidth;
    // fix rounding errors, typically with gutters
    var excess = columnWidth - containerWidth % columnWidth;
    // if overshoot is less than a pixel, round up, otherwise floor it
    var mathMethod = excess && excess < 1 ? 'round' : 'floor';
    cols = Math[ mathMethod ]( cols );
    this.cols = Math.max( cols, 1 );
  };

  proto.getContainerWidth = function() {
    // container is parent if fit width
    var isFitWidth = this._getOption('fitWidth');
    var container = isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize( container );
    this.containerWidth = size && size.innerWidth;
  };

  proto._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );
    // use horizontal or top column position
    var colPosMethod = this.options.horizontalOrder ?
      '_getHorizontalColPosition' : '_getTopColPosition';
    var colPosition = this[ colPosMethod ]( colSpan, item );
    // position the brick
    var position = {
      x: this.columnWidth * colPosition.col,
      y: colPosition.y
    };
    // apply setHeight to necessary columns
    var setHeight = colPosition.y + item.size.outerHeight;
    var setMax = colSpan + colPosition.col;
    for ( var i = colPosition.col; i < setMax; i++ ) {
      this.colYs[i] = setHeight;
    }

    return position;
  };

  proto._getTopColPosition = function( colSpan ) {
    var colGroup = this._getTopColGroup( colSpan );
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );

    return {
      col: colGroup.indexOf( minimumY ),
      y: minimumY,
    };
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  proto._getTopColGroup = function( colSpan ) {
    if ( colSpan < 2 ) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      colGroup[i] = this._getColGroupY( i, colSpan );
    }
    return colGroup;
  };

  proto._getColGroupY = function( col, colSpan ) {
    if ( colSpan < 2 ) {
      return this.colYs[ col ];
    }
    // make an array of colY values for that one group
    var groupColYs = this.colYs.slice( col, col + colSpan );
    // and get the max value of the array
    return Math.max.apply( Math, groupColYs );
  };

  // get column position based on horizontal index. #873
  proto._getHorizontalColPosition = function( colSpan, item ) {
    var col = this.horizontalColIndex % this.cols;
    var isOver = colSpan > 1 && col + colSpan > this.cols;
    // shift to next row if item can't fit on current row
    col = isOver ? 0 : col;
    // don't let zero-size items take up space
    var hasSize = item.size.outerWidth && item.size.outerHeight;
    this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;

    return {
      col: col,
      y: this._getColGroupY( col, colSpan ),
    };
  };

  proto._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this._getElementOffset( stamp );
    // get the columns that this stamp affects
    var isOriginLeft = this._getOption('originLeft');
    var firstX = isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp

    var isOriginTop = this._getOption('originTop');
    var stampMaxY = ( isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  proto._getContainerSize = function() {
    this.maxY = Math.max.apply( Math, this.colYs );
    var size = {
      height: this.maxY
    };

    if ( this._getOption('fitWidth') ) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  proto._getContainerFitWidth = function() {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while ( --i ) {
      if ( this.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
  };

  proto.needsResizeLayout = function() {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth != this.containerWidth;
  };

  return Masonry;

}));


/***/ }),

/***/ 652:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Outlayer Item
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if ( true ) {
    // AMD - RequireJS
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(158),
        __webpack_require__(131)
      ], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( EvEmitter, getSize ) {
'use strict';

// ----- helpers ----- //

function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// -------------------------- CSS3 support -------------------------- //


var docElemStyle = document.documentElement.style;

var transitionProperty = typeof docElemStyle.transition == 'string' ?
  'transition' : 'WebkitTransition';
var transformProperty = typeof docElemStyle.transform == 'string' ?
  'transform' : 'WebkitTransform';

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  transition: 'transitionend'
}[ transitionProperty ];

// cache all vendor properties that could have vendor prefix
var vendorProperties = {
  transform: transformProperty,
  transition: transitionProperty,
  transitionDuration: transitionProperty + 'Duration',
  transitionProperty: transitionProperty + 'Property',
  transitionDelay: transitionProperty + 'Delay'
};

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EvEmitter
var proto = Item.prototype = Object.create( EvEmitter.prototype );
proto.constructor = Item;

proto._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

proto.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
proto.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
proto.getPosition = function() {
  var style = getComputedStyle( this.element );
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');
  var xValue = style[ isOriginLeft ? 'left' : 'right' ];
  var yValue = style[ isOriginTop ? 'top' : 'bottom' ];
  var x = parseFloat( xValue );
  var y = parseFloat( yValue );
  // convert percent to pixels
  var layoutSize = this.layout.size;
  if ( xValue.indexOf('%') != -1 ) {
    x = ( x / 100 ) * layoutSize.width;
  }
  if ( yValue.indexOf('%') != -1 ) {
    y = ( y / 100 ) * layoutSize.height;
  }
  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
proto.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var style = {};
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');

  // x
  var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
  var xProperty = isOriginLeft ? 'left' : 'right';
  var xResetProperty = isOriginLeft ? 'right' : 'left';

  var x = this.position.x + layoutSize[ xPadding ];
  // set in percentage or pixels
  style[ xProperty ] = this.getXValue( x );
  // reset other property
  style[ xResetProperty ] = '';

  // y
  var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
  var yProperty = isOriginTop ? 'top' : 'bottom';
  var yResetProperty = isOriginTop ? 'bottom' : 'top';

  var y = this.position.y + layoutSize[ yPadding ];
  // set in percentage or pixels
  style[ yProperty ] = this.getYValue( y );
  // reset other property
  style[ yResetProperty ] = '';

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};

proto.getXValue = function( x ) {
  var isHorizontal = this.layout._getOption('horizontal');
  return this.layout.options.percentPosition && !isHorizontal ?
    ( ( x / this.layout.size.width ) * 100 ) + '%' : x + 'px';
};

proto.getYValue = function( y ) {
  var isHorizontal = this.layout._getOption('horizontal');
  return this.layout.options.percentPosition && isHorizontal ?
    ( ( y / this.layout.size.height ) * 100 ) + '%' : y + 'px';
};

proto._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var didNotMove = x == this.position.x && y == this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  transitionStyle.transform = this.getTranslate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

proto.getTranslate = function( x, y ) {
  // flip cooridinates if origin on right or bottom
  var isOriginLeft = this.layout._getOption('originLeft');
  var isOriginTop = this.layout._getOption('originTop');
  x = isOriginLeft ? x : -x;
  y = isOriginTop ? y : -y;
  return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
};

// non transition + transform support
proto.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

proto.moveTo = proto._transitionTo;

proto.setPosition = function( x, y ) {
  this.position.x = parseFloat( x );
  this.position.y = parseFloat( y );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
proto._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
proto.transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

// dash before all cap letters, including first for
// WebkitTransform => -webkit-transform
function toDashedAll( str ) {
  return str.replace( /([A-Z])/g, function( $1 ) {
    return '-' + $1.toLowerCase();
  });
}

var transitionProps = 'opacity,' + toDashedAll( transformProperty );

proto.enableTransition = function(/* style */) {
  // HACK changing transitionProperty during a transition
  // will cause transition to jump
  if ( this.isTransitioning ) {
    return;
  }

  // make `transition: foo, bar, baz` from style object
  // HACK un-comment this when enableTransition can work
  // while a transition is happening
  // var transitionValues = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   prop = vendorProperties[ prop ] || prop;
  //   transitionValues.push( toDashedAll( prop ) );
  // }
  // munge number to millisecond, to match stagger
  var duration = this.layout.options.transitionDuration;
  duration = typeof duration == 'number' ? duration + 'ms' : duration;
  // enable transition styles
  this.css({
    transitionProperty: transitionProps,
    transitionDuration: duration,
    transitionDelay: this.staggerDelay || 0
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

// ----- events ----- //

proto.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

proto.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform'
};

proto.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

proto.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
proto._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: '',
  transitionDelay: ''
};

proto.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- stagger ----- //

proto.stagger = function( delay ) {
  delay = isNaN( delay ) ? 0 : delay;
  this.staggerDelay = delay + 'ms';
};

// ----- show/hide/remove ----- //

// remove element from DOM
proto.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  // remove display: none
  this.css({ display: '' });
  this.emitEvent( 'remove', [ this ] );
};

proto.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  this.once( 'transitionEnd', function() {
    this.removeElem();
  });
  this.hide();
};

proto.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onRevealTransitionEnd;

  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

proto.onRevealTransitionEnd = function() {
  // check if still visible
  // during transition, item may have been hidden
  if ( !this.isHidden ) {
    this.emitEvent('reveal');
  }
};

/**
 * get style property use for hide/reveal transition end
 * @param {String} styleProperty - hiddenStyle/visibleStyle
 * @returns {String}
 */
proto.getHideRevealTransitionEndProperty = function( styleProperty ) {
  var optionStyle = this.layout.options[ styleProperty ];
  // use opacity
  if ( optionStyle.opacity ) {
    return 'opacity';
  }
  // get first property
  for ( var prop in optionStyle ) {
    return prop;
  }
};

proto.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;

  var onTransitionEnd = {};
  var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
  onTransitionEnd[ transitionEndProperty ] = this.onHideTransitionEnd;

  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: onTransitionEnd
  });
};

proto.onHideTransitionEnd = function() {
  // check if still hidden
  // during transition, item may have been un-hidden
  if ( this.isHidden ) {
    this.css({ display: 'none' });
    this.emitEvent('hide');
  }
};

proto.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}));


/***/ }),

/***/ 794:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Outlayer v2.1.1
 * the brains and guts of a layout library
 * MIT license
 */

( function( window, factory ) {
  'use strict';
  // universal module definition
  /* jshint strict: false */ /* globals define, module, require */
  if ( true ) {
    // AMD - RequireJS
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
        __webpack_require__(158),
        __webpack_require__(131),
        __webpack_require__(47),
        __webpack_require__(652)
      ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( EvEmitter, getSize, utils, Item ) {
        return factory( window, EvEmitter, getSize, utils, Item);
      }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, EvEmitter, getSize, utils, Item ) {
'use strict';

// ----- vars ----- //

var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  var queryElement = utils.getQueryElement( element );
  if ( !queryElement ) {
    if ( console ) {
      console.error( 'Bad element for ' + this.constructor.namespace +
        ': ' + ( queryElement || element ) );
    }
    return;
  }
  this.element = queryElement;
  // add jQuery
  if ( jQuery ) {
    this.$element = jQuery( this.element );
  }

  // options
  this.options = utils.extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  var isInitLayout = this._getOption('initLayout');
  if ( isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  initLayout: true,
  originLeft: true,
  originTop: true,
  resize: true,
  resizeContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

var proto = Outlayer.prototype;
// inherit EvEmitter
utils.extend( proto, EvEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
proto.option = function( opts ) {
  utils.extend( this.options, opts );
};

/**
 * get backwards compatible option value, check old name
 */
proto._getOption = function( option ) {
  var oldOption = this.constructor.compatOptions[ option ];
  return oldOption && this.options[ oldOption ] !== undefined ?
    this.options[ oldOption ] : this.options[ option ];
};

Outlayer.compatOptions = {
  // currentName: oldName
  initLayout: 'isInitLayout',
  horizontal: 'isHorizontal',
  layoutInstant: 'isLayoutInstant',
  originLeft: 'isOriginLeft',
  originTop: 'isOriginTop',
  resize: 'isResizeBound',
  resizeContainer: 'isResizingContainer'
};

proto._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  utils.extend( this.element.style, this.options.containerStyle );

  // bind resize method
  var canBindResize = this._getOption('resize');
  if ( canBindResize ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
proto.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
proto._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0; i < itemElems.length; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
proto._filterFindItemElements = function( elems ) {
  return utils.filterFindElements( elems, this.options.itemSelector );
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
proto.getItemElements = function() {
  return this.items.map( function( item ) {
    return item.element;
  });
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
proto.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var layoutInstant = this._getOption('layoutInstant');
  var isInstant = layoutInstant !== undefined ?
    layoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
proto._init = proto.layout;

/**
 * logic before any new layout
 */
proto._resetLayout = function() {
  this.getSize();
};


proto.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
proto._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option == 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( option instanceof HTMLElement ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
proto.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
proto._getItemsForLayout = function( items ) {
  return items.filter( function( item ) {
    return !item.isIgnored;
  });
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
proto._layoutItems = function( items, isInstant ) {
  this._emitCompleteOnItems( 'layout', items );

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    return;
  }

  var queue = [];

  items.forEach( function( item ) {
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }, this );

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
proto._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
proto._processLayoutQueue = function( queue ) {
  this.updateStagger();
  queue.forEach( function( obj, i ) {
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant, i );
  }, this );
};

// set stagger from option in milliseconds number
proto.updateStagger = function() {
  var stagger = this.options.stagger;
  if ( stagger === null || stagger === undefined ) {
    this.stagger = 0;
    return;
  }
  this.stagger = getMilliseconds( stagger );
  return this.stagger;
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
proto._positionItem = function( item, x, y, isInstant, i ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.stagger( i * this.stagger );
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
proto._postLayout = function() {
  this.resizeContainer();
};

proto.resizeContainer = function() {
  var isResizingContainer = this._getOption('resizeContainer');
  if ( !isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
proto._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
proto._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * emit eventComplete on a collection of items events
 * @param {String} eventName
 * @param {Array} items - Outlayer.Items
 */
proto._emitCompleteOnItems = function( eventName, items ) {
  var _this = this;
  function onComplete() {
    _this.dispatchEvent( eventName + 'Complete', null, [ items ] );
  }

  var count = items.length;
  if ( !items || !count ) {
    onComplete();
    return;
  }

  var doneCount = 0;
  function tick() {
    doneCount++;
    if ( doneCount == count ) {
      onComplete();
    }
  }

  // bind callback
  items.forEach( function( item ) {
    item.once( eventName, tick );
  });
};

/**
 * emits events via EvEmitter and jQuery events
 * @param {String} type - name of event
 * @param {Event} event - original event
 * @param {Array} args - extra arguments
 */
proto.dispatchEvent = function( type, event, args ) {
  // add original event to arguments
  var emitArgs = event ? [ event ].concat( args ) : args;
  this.emitEvent( type, emitArgs );

  if ( jQuery ) {
    // set this.$element
    this.$element = this.$element || jQuery( this.element );
    if ( event ) {
      // create jQuery event
      var $event = jQuery.Event( event );
      $event.type = type;
      this.$element.trigger( $event, args );
    } else {
      // just trigger with type if no event available
      this.$element.trigger( type, args );
    }
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
proto.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
proto.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
proto.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  elems.forEach( this.ignore, this );
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
proto.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  elems.forEach( function( elem ) {
    // filter out removed stamp elements
    utils.removeFrom( this.stamps, elem );
    this.unignore( elem );
  }, this );
};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
proto._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems == 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = utils.makeArray( elems );
  return elems;
};

proto._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  this.stamps.forEach( this._manageStamp, this );
};

// update boundingLeft / Top
proto._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
proto._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
proto._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
proto.handleEvent = utils.handleEvent;

/**
 * Bind layout to window resizing
 */
proto.bindResize = function() {
  window.addEventListener( 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
proto.unbindResize = function() {
  window.removeEventListener( 'resize', this );
  this.isResizeBound = false;
};

proto.onresize = function() {
  this.resize();
};

utils.debounceMethod( Outlayer, 'onresize', 100 );

proto.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9
  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
proto.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
proto.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
proto.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
proto.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
proto.reveal = function( items ) {
  this._emitCompleteOnItems( 'reveal', items );
  if ( !items || !items.length ) {
    return;
  }
  var stagger = this.updateStagger();
  items.forEach( function( item, i ) {
    item.stagger( i * stagger );
    item.reveal();
  });
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
proto.hide = function( items ) {
  this._emitCompleteOnItems( 'hide', items );
  if ( !items || !items.length ) {
    return;
  }
  var stagger = this.updateStagger();
  items.forEach( function( item, i ) {
    item.stagger( i * stagger );
    item.hide();
  });
};

/**
 * reveal item elements
 * @param {Array}, {Element}, {NodeList} items
 */
proto.revealItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.reveal( items );
};

/**
 * hide item elements
 * @param {Array}, {Element}, {NodeList} items
 */
proto.hideItemElements = function( elems ) {
  var items = this.getItems( elems );
  this.hide( items );
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
proto.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0; i < this.items.length; i++ ) {
    var item = this.items[i];
    if ( item.element == elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
proto.getItems = function( elems ) {
  elems = utils.makeArray( elems );
  var items = [];
  elems.forEach( function( elem ) {
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }, this );

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
proto.remove = function( elems ) {
  var removeItems = this.getItems( elems );

  this._emitCompleteOnItems( 'remove', removeItems );

  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  removeItems.forEach( function( item ) {
    item.remove();
    // remove item from collection
    utils.removeFrom( this.items, item );
  }, this );
};

// ----- destroy ----- //

// remove and disable Outlayer instance
proto.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  this.items.forEach( function( item ) {
    item.destroy();
  });

  this.unbindResize();

  var id = this.element.outlayerGUID;
  delete instances[ id ]; // remove reference to instance by id
  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  elem = utils.getQueryElement( elem );
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  var Layout = subclass( Outlayer );
  // apply new options and compatOptions
  Layout.defaults = utils.extend( {}, Outlayer.defaults );
  utils.extend( Layout.defaults, options );
  Layout.compatOptions = utils.extend( {}, Outlayer.compatOptions  );

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = subclass( Item );

  // -------------------------- declarative -------------------------- //

  utils.htmlInit( Layout, namespace );

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

function subclass( Parent ) {
  function SubClass() {
    Parent.apply( this, arguments );
  }

  SubClass.prototype = Object.create( Parent.prototype );
  SubClass.prototype.constructor = SubClass;

  return SubClass;
}

// ----- helpers ----- //

// how many milliseconds are in each unit
var msUnits = {
  ms: 1,
  s: 1000
};

// munge time-like parameter into millisecond number
// '0.4s' -> 40
function getMilliseconds( time ) {
  if ( typeof time == 'number' ) {
    return time;
  }
  var matches = time.match( /(^\d*\.?\d*)(\w*)/ );
  var num = matches && matches[1];
  var unit = matches && matches[2];
  if ( !num.length ) {
    return 0;
  }
  num = parseFloat( num );
  var mult = msUnits[ unit ] || 1;
  return num * mult;
}

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}));


/***/ }),

/***/ 277:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */

(function (name, definition) {
  if ( true && module.exports) module.exports = definition()
  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  else {}
})('$script', function () {
  var doc = document
    , head = doc.getElementsByTagName('head')[0]
    , s = 'string'
    , f = false
    , push = 'push'
    , readyState = 'readyState'
    , onreadystatechange = 'onreadystatechange'
    , list = {}
    , ids = {}
    , delay = {}
    , scripts = {}
    , scriptpath
    , urlArgs

  function every(ar, fn) {
    for (var i = 0, j = ar.length; i < j; ++i) if (!fn(ar[i])) return f
    return 1
  }
  function each(ar, fn) {
    every(ar, function (el) {
      fn(el)
      return 1
    })
  }

  function $script(paths, idOrDone, optDone) {
    paths = paths[push] ? paths : [paths]
    var idOrDoneIsDone = idOrDone && idOrDone.call
      , done = idOrDoneIsDone ? idOrDone : optDone
      , id = idOrDoneIsDone ? paths.join('') : idOrDone
      , queue = paths.length
    function loopFn(item) {
      return item.call ? item() : list[item]
    }
    function callback() {
      if (!--queue) {
        list[id] = 1
        done && done()
        for (var dset in delay) {
          every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
        }
      }
    }
    setTimeout(function () {
      each(paths, function loading(path, force) {
        if (path === null) return callback()
        
        if (!force && !/^https?:\/\//.test(path) && scriptpath) {
          path = (path.indexOf('.js') === -1) ? scriptpath + path + '.js' : scriptpath + path;
        }
        
        if (scripts[path]) {
          if (id) ids[id] = 1
          return (scripts[path] == 2) ? callback() : setTimeout(function () { loading(path, true) }, 0)
        }

        scripts[path] = 1
        if (id) ids[id] = 1
        create(path, callback)
      })
    }, 0)
    return $script
  }

  function create(path, fn) {
    var el = doc.createElement('script'), loaded
    el.onload = el.onerror = el[onreadystatechange] = function () {
      if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
      el.onload = el[onreadystatechange] = null
      loaded = 1
      scripts[path] = 2
      fn()
    }
    el.async = 1
    el.src = urlArgs ? path + (path.indexOf('?') === -1 ? '?' : '&') + urlArgs : path;
    head.insertBefore(el, head.lastChild)
  }

  $script.get = create

  $script.order = function (scripts, id, done) {
    (function callback(s) {
      s = scripts.shift()
      !scripts.length ? $script(s, id, done) : $script(s, callback)
    }())
  }

  $script.path = function (p) {
    scriptpath = p
  }
  $script.urlArgs = function (str) {
    urlArgs = str;
  }
  $script.ready = function (deps, ready, req) {
    deps = deps[push] ? deps : [deps]
    var missing = [];
    !each(deps, function (dep) {
      list[dep] || missing[push](dep);
    }) && every(deps, function (dep) {return list[dep]}) ?
      ready() : !function (key) {
      delay[key] = delay[key] || []
      delay[key][push](ready)
      req && req(missing)
    }(deps.join('|'))
    return $script
  }

  $script.done = function (idOrDone) {
    $script([null], idOrDone)
  }

  return $script
});


/***/ }),

/***/ 842:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Unidragger v2.3.1
 * Draggable base class
 * MIT license
 */

/*jshint browser: true, unused: true, undef: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /*jshint strict: false */ /*globals define, module, require */

  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(704)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( Unipointer ) {
      return factory( window, Unipointer );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, Unipointer ) {

'use strict';

// -------------------------- Unidragger -------------------------- //

function Unidragger() {}

// inherit Unipointer & EvEmitter
var proto = Unidragger.prototype = Object.create( Unipointer.prototype );

// ----- bind start ----- //

proto.bindHandles = function() {
  this._bindHandles( true );
};

proto.unbindHandles = function() {
  this._bindHandles( false );
};

/**
 * Add or remove start event
 * @param {Boolean} isAdd
 */
proto._bindHandles = function( isAdd ) {
  // munge isAdd, default to true
  isAdd = isAdd === undefined ? true : isAdd;
  // bind each handle
  var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';
  var touchAction = isAdd ? this._touchActionValue : '';
  for ( var i=0; i < this.handles.length; i++ ) {
    var handle = this.handles[i];
    this._bindStartEvent( handle, isAdd );
    handle[ bindMethod ]( 'click', this );
    // touch-action: none to override browser touch gestures. metafizzy/flickity#540
    if ( window.PointerEvent ) {
      handle.style.touchAction = touchAction;
    }
  }
};

// prototype so it can be overwriteable by Flickity
proto._touchActionValue = 'none';

// ----- start event ----- //

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerDown = function( event, pointer ) {
  var isOkay = this.okayPointerDown( event );
  if ( !isOkay ) {
    return;
  }
  // track start event position
  // Safari 9 overrides pageX and pageY. These values needs to be copied. flickity#842
  this.pointerDownPointer = {
    pageX: pointer.pageX,
    pageY: pointer.pageY,
  };

  event.preventDefault();
  this.pointerDownBlur();
  // bind move and end events
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// nodes that have text fields
var cursorNodes = {
  TEXTAREA: true,
  INPUT: true,
  SELECT: true,
  OPTION: true,
};

// input types that do not have text fields
var clickTypes = {
  radio: true,
  checkbox: true,
  button: true,
  submit: true,
  image: true,
  file: true,
};

// dismiss inputs with text fields. flickity#403, flickity#404
proto.okayPointerDown = function( event ) {
  var isCursorNode = cursorNodes[ event.target.nodeName ];
  var isClickType = clickTypes[ event.target.type ];
  var isOkay = !isCursorNode || isClickType;
  if ( !isOkay ) {
    this._pointerReset();
  }
  return isOkay;
};

// kludge to blur previously focused input
proto.pointerDownBlur = function() {
  var focused = document.activeElement;
  // do not blur body for IE10, metafizzy/flickity#117
  var canBlur = focused && focused.blur && focused != document.body;
  if ( canBlur ) {
    focused.blur();
  }
};

// ----- move event ----- //

/**
 * drag move
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerMove = function( event, pointer ) {
  var moveVector = this._dragPointerMove( event, pointer );
  this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
  this._dragMove( event, pointer, moveVector );
};

// base pointer move logic
proto._dragPointerMove = function( event, pointer ) {
  var moveVector = {
    x: pointer.pageX - this.pointerDownPointer.pageX,
    y: pointer.pageY - this.pointerDownPointer.pageY
  };
  // start drag if pointer has moved far enough to start drag
  if ( !this.isDragging && this.hasDragStarted( moveVector ) ) {
    this._dragStart( event, pointer );
  }
  return moveVector;
};

// condition if pointer has moved far enough to start drag
proto.hasDragStarted = function( moveVector ) {
  return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
};

// ----- end event ----- //

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
  this._dragPointerUp( event, pointer );
};

proto._dragPointerUp = function( event, pointer ) {
  if ( this.isDragging ) {
    this._dragEnd( event, pointer );
  } else {
    // pointer didn't move enough for drag to start
    this._staticClick( event, pointer );
  }
};

// -------------------------- drag -------------------------- //

// dragStart
proto._dragStart = function( event, pointer ) {
  this.isDragging = true;
  // prevent clicks
  this.isPreventingClicks = true;
  this.dragStart( event, pointer );
};

proto.dragStart = function( event, pointer ) {
  this.emitEvent( 'dragStart', [ event, pointer ] );
};

// dragMove
proto._dragMove = function( event, pointer, moveVector ) {
  // do not drag if not dragging yet
  if ( !this.isDragging ) {
    return;
  }

  this.dragMove( event, pointer, moveVector );
};

proto.dragMove = function( event, pointer, moveVector ) {
  event.preventDefault();
  this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
};

// dragEnd
proto._dragEnd = function( event, pointer ) {
  // set flags
  this.isDragging = false;
  // re-enable clicking async
  setTimeout( function() {
    delete this.isPreventingClicks;
  }.bind( this ) );

  this.dragEnd( event, pointer );
};

proto.dragEnd = function( event, pointer ) {
  this.emitEvent( 'dragEnd', [ event, pointer ] );
};

// ----- onclick ----- //

// handle all clicks and prevent clicks when dragging
proto.onclick = function( event ) {
  if ( this.isPreventingClicks ) {
    event.preventDefault();
  }
};

// ----- staticClick ----- //

// triggered after pointer down & up with no/tiny movement
proto._staticClick = function( event, pointer ) {
  // ignore emulated mouse up clicks
  if ( this.isIgnoringMouseUp && event.type == 'mouseup' ) {
    return;
  }

  this.staticClick( event, pointer );

  // set flag for emulated clicks 300ms after touchend
  if ( event.type != 'mouseup' ) {
    this.isIgnoringMouseUp = true;
    // reset flag after 300ms
    setTimeout( function() {
      delete this.isIgnoringMouseUp;
    }.bind( this ), 400 );
  }
};

proto.staticClick = function( event, pointer ) {
  this.emitEvent( 'staticClick', [ event, pointer ] );
};

// ----- utils ----- //

Unidragger.getPointerPoint = Unipointer.getPointerPoint;

// -----  ----- //

return Unidragger;

}));


/***/ }),

/***/ 704:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Unipointer v2.3.0
 * base class for doing one thing with pointer event
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true, strict: true */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*global define, module, require */
  if ( true ) {
    // AMD
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [
      __webpack_require__(158)
    ], __WEBPACK_AMD_DEFINE_RESULT__ = (function( EvEmitter ) {
      return factory( window, EvEmitter );
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}

}( window, function factory( window, EvEmitter ) {

'use strict';

function noop() {}

function Unipointer() {}

// inherit EvEmitter
var proto = Unipointer.prototype = Object.create( EvEmitter.prototype );

proto.bindStartEvent = function( elem ) {
  this._bindStartEvent( elem, true );
};

proto.unbindStartEvent = function( elem ) {
  this._bindStartEvent( elem, false );
};

/**
 * Add or remove start event
 * @param {Boolean} isAdd - remove if falsey
 */
proto._bindStartEvent = function( elem, isAdd ) {
  // munge isAdd, default to true
  isAdd = isAdd === undefined ? true : isAdd;
  var bindMethod = isAdd ? 'addEventListener' : 'removeEventListener';

  // default to mouse events
  var startEvent = 'mousedown';
  if ( window.PointerEvent ) {
    // Pointer Events
    startEvent = 'pointerdown';
  } else if ( 'ontouchstart' in window ) {
    // Touch Events. iOS Safari
    startEvent = 'touchstart';
  }
  elem[ bindMethod ]( startEvent, this );
};

// trigger handler methods for events
proto.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

// returns the touch that we're keeping track of
proto.getTouch = function( touches ) {
  for ( var i=0; i < touches.length; i++ ) {
    var touch = touches[i];
    if ( touch.identifier == this.pointerIdentifier ) {
      return touch;
    }
  }
};

// ----- start event ----- //

proto.onmousedown = function( event ) {
  // dismiss clicks from right or middle buttons
  var button = event.button;
  if ( button && ( button !== 0 && button !== 1 ) ) {
    return;
  }
  this._pointerDown( event, event );
};

proto.ontouchstart = function( event ) {
  this._pointerDown( event, event.changedTouches[0] );
};

proto.onpointerdown = function( event ) {
  this._pointerDown( event, event );
};

/**
 * pointer start
 * @param {Event} event
 * @param {Event or Touch} pointer
 */
proto._pointerDown = function( event, pointer ) {
  // dismiss right click and other pointers
  // button = 0 is okay, 1-4 not
  if ( event.button || this.isPointerDown ) {
    return;
  }

  this.isPointerDown = true;
  // save pointer identifier to match up touch events
  this.pointerIdentifier = pointer.pointerId !== undefined ?
    // pointerId for pointer events, touch.indentifier for touch events
    pointer.pointerId : pointer.identifier;

  this.pointerDown( event, pointer );
};

proto.pointerDown = function( event, pointer ) {
  this._bindPostStartEvents( event );
  this.emitEvent( 'pointerDown', [ event, pointer ] );
};

// hash of events to be bound after start event
var postStartEvents = {
  mousedown: [ 'mousemove', 'mouseup' ],
  touchstart: [ 'touchmove', 'touchend', 'touchcancel' ],
  pointerdown: [ 'pointermove', 'pointerup', 'pointercancel' ],
};

proto._bindPostStartEvents = function( event ) {
  if ( !event ) {
    return;
  }
  // get proper events to match start event
  var events = postStartEvents[ event.type ];
  // bind events to node
  events.forEach( function( eventName ) {
    window.addEventListener( eventName, this );
  }, this );
  // save these arguments
  this._boundPointerEvents = events;
};

proto._unbindPostStartEvents = function() {
  // check for _boundEvents, in case dragEnd triggered twice (old IE8 bug)
  if ( !this._boundPointerEvents ) {
    return;
  }
  this._boundPointerEvents.forEach( function( eventName ) {
    window.removeEventListener( eventName, this );
  }, this );

  delete this._boundPointerEvents;
};

// ----- move event ----- //

proto.onmousemove = function( event ) {
  this._pointerMove( event, event );
};

proto.onpointermove = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerMove( event, event );
  }
};

proto.ontouchmove = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerMove( event, touch );
  }
};

/**
 * pointer move
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerMove = function( event, pointer ) {
  this.pointerMove( event, pointer );
};

// public
proto.pointerMove = function( event, pointer ) {
  this.emitEvent( 'pointerMove', [ event, pointer ] );
};

// ----- end event ----- //


proto.onmouseup = function( event ) {
  this._pointerUp( event, event );
};

proto.onpointerup = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerUp( event, event );
  }
};

proto.ontouchend = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerUp( event, touch );
  }
};

/**
 * pointer up
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerUp = function( event, pointer ) {
  this._pointerDone();
  this.pointerUp( event, pointer );
};

// public
proto.pointerUp = function( event, pointer ) {
  this.emitEvent( 'pointerUp', [ event, pointer ] );
};

// ----- pointer done ----- //

// triggered on pointer up & pointer cancel
proto._pointerDone = function() {
  this._pointerReset();
  this._unbindPostStartEvents();
  this.pointerDone();
};

proto._pointerReset = function() {
  // reset properties
  this.isPointerDown = false;
  delete this.pointerIdentifier;
};

proto.pointerDone = noop;

// ----- pointer cancel ----- //

proto.onpointercancel = function( event ) {
  if ( event.pointerId == this.pointerIdentifier ) {
    this._pointerCancel( event, event );
  }
};

proto.ontouchcancel = function( event ) {
  var touch = this.getTouch( event.changedTouches );
  if ( touch ) {
    this._pointerCancel( event, touch );
  }
};

/**
 * pointer cancel
 * @param {Event} event
 * @param {Event or Touch} pointer
 * @private
 */
proto._pointerCancel = function( event, pointer ) {
  this._pointerDone();
  this.pointerCancel( event, pointer );
};

// public
proto.pointerCancel = function( event, pointer ) {
  this.emitEvent( 'pointerCancel', [ event, pointer ] );
};

// -----  ----- //

// utility function for getting x/y coords from event
Unipointer.getPointerPoint = function( pointer ) {
  return {
    x: pointer.pageX,
    y: pointer.pageY
  };
};

// -----  ----- //

return Unipointer;

}));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
!function() {
"use strict";

// EXTERNAL MODULE: ./source/scripts/polyfills/nodeListForEach.js
var nodeListForEach = __webpack_require__(194);
// EXTERNAL MODULE: ./source/scripts/helpers/globals.js
var globals = __webpack_require__(43);
;// CONCATENATED MODULE: ./node_modules/@pixelunion/shopify-sections-manager/dist/shopify-sections-manager.es.js

/*!
 * @pixelunion/shopify-sections-manager v1.0.0
 * (c) 2019 Pixel Union
 */

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

function triggerInstanceEvent(instance, eventName) {
  if (instance && instance[eventName]) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    instance[eventName].apply(instance, args);
  }
}

function loadData(el) {
  var dataEl = el.querySelector('[data-section-data]');
  if (!dataEl) return {};

  // Load data from attribute, or innerHTML
  var data = dataEl.getAttribute('data-section-data') || dataEl.innerHTML;

  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn('Sections: invalid section data found. ' + error.message);
    return {};
  }
}

var ShopifySectionsManager = function () {
  function ShopifySectionsManager() {
    classCallCheck(this, ShopifySectionsManager);

    this.handlers = {};
    this.instances = {};
    this._onSectionEvent = this._onSectionEvent.bind(this);

    document.addEventListener('shopify:section:load', this._onSectionEvent);
    document.addEventListener('shopify:section:unload', this._onSectionEvent);
    document.addEventListener('shopify:section:select', this._onSectionEvent);
    document.addEventListener('shopify:section:deselect', this._onSectionEvent);
    document.addEventListener('shopify:section:reorder', this._onSectionEvent);
    document.addEventListener('shopify:block:select', this._onSectionEvent);
    document.addEventListener('shopify:block:deselect', this._onSectionEvent);
  }

  /**
   * Stop listening for section events, and unbind all handlers.
   */


  createClass(ShopifySectionsManager, [{
    key: 'unbind',
    value: function unbind() {
      document.removeEventListener('shopify:section:load', this._onSectionEvent);
      document.removeEventListener('shopify:section:unload', this._onSectionEvent);
      document.removeEventListener('shopify:section:select', this._onSectionEvent);
      document.removeEventListener('shopify:section:deselect', this._onSectionEvent);
      document.removeEventListener('shopify:section:reorder', this._onSectionEvent);
      document.removeEventListener('shopify:block:select', this._onSectionEvent);
      document.removeEventListener('shopify:block:deselect', this._onSectionEvent);

      // Unload all instances
      for (var i = 0; i < this.instances.length; i++) {
        triggerInstanceEvent(this.instances[i], 'onSectionUnload');
      }

      this.handlers = {};
      this.instances = {};
    }

    /**
     * Register a section handler.
     *
     * @param {string} type
     *        The section type to handle. The handler will be called for all
     *        sections with this type.
     *
     * @param {function} handler
     *        The handler function is passed information about a specific section
     *        instance. The handler is expected to return an object that will be
     *        associated with the section instance.
     *
     *        Section handlers are passed an object with the following parameters:
     *          {string} id
     *          An ID that maps to a specific section instance. Typically the
     *          section's filename for static sections, or a generated ID for
     *          dynamic sections.
     *
     *          {string} type
     *          The section type, as supplied when registered.
     *
     *          {Element} el
     *          The root DOM element for the section instance.
     *
     *          {Object} data
     *          Data loaded from the section script element. Defaults to an
     *          empty object.
     *
     *          {Function} postMessage
     *          A function that can be called to pass messages between sections.
     *          The function should be called with a message "name", and
     *          optionally some data.
     */

  }, {
    key: 'register',
    value: function register(type, handler) {
      if (this.handlers[type]) {
        console.warn('Sections: section handler already exists of type \'' + type + '\'.');
      }

      // Store the section handler
      this.handlers[type] = handler;

      // Init sections for this type
      this._initSections(type);
    }

    /**
     * Initialize sections already on the page.
     */

  }, {
    key: '_initSections',
    value: function _initSections(type) {
      // Fetch all existing sections of our type on the page
      var dataEls = document.querySelectorAll('[data-section-type="' + type + '"]');
      if (!dataEls) return;

      // Create an instance for each section
      for (var i = 0; i < dataEls.length; i++) {
        var dataEl = dataEls[i];
        var el = dataEl.parentNode;

        // Get instance ID
        var idEl = el.querySelector('[data-section-id]');

        if (!idEl) {
          console.warn('Sections: unable to find section id for \'' + type + '\'.', el);
          return;
        }

        var sectionId = idEl.getAttribute('data-section-id');
        if (!sectionId) {
          console.warn('Sections: unable to find section id for \'' + type + '\'.', el);
          return;
        }

        this._createInstance(sectionId, el);
      }
    }
  }, {
    key: '_onSectionEvent',
    value: function _onSectionEvent(event) {
      var el = event.target;
      var sectionId = event.detail.sectionId;
      var blockId = event.detail.blockId;
      var instance = this.instances[sectionId];

      switch (event.type) {
        case 'shopify:section:load':
          this._createInstance(sectionId, el);
          break;

        case 'shopify:section:unload':
          triggerInstanceEvent(instance, 'onSectionUnload', { el: el, id: sectionId });
          delete this.instances[sectionId];
          break;

        case 'shopify:section:select':
          triggerInstanceEvent(instance, 'onSectionSelect', { el: el, id: sectionId });
          break;

        case 'shopify:section:deselect':
          triggerInstanceEvent(instance, 'onSectionDeselect', { el: el, id: sectionId });
          break;

        case 'shopify:section:reorder':
          triggerInstanceEvent(instance, 'onSectionReorder', { el: el, id: sectionId });
          break;

        case 'shopify:block:select':
          triggerInstanceEvent(instance, 'onSectionBlockSelect', { el: el, id: blockId });
          break;

        case 'shopify:block:deselect':
          triggerInstanceEvent(instance, 'onSectionBlockDeselect', { el: el, id: blockId });
          break;

        default:
          break;
      }
    }
  }, {
    key: '_postMessage',
    value: function _postMessage(name, data) {
      var _this = this;

      Object.keys(this.instances).forEach(function (id) {
        triggerInstanceEvent(_this.instances[id], 'onSectionMessage', name, data);
      });
    }
  }, {
    key: '_createInstance',
    value: function _createInstance(id, el) {
      var typeEl = el.querySelector('[data-section-type]');
      if (!typeEl) return;

      var type = typeEl.getAttribute('data-section-type');
      if (!type) return;

      var handler = this.handlers[type];
      if (!handler) {
        console.warn('Sections: unable to find section handler for type \'' + type + '\'.');
        return;
      }

      var data = loadData(el);
      var postMessage = this._postMessage.bind(this);

      this.instances[id] = handler({ id: id, type: type, el: el, data: data, postMessage: postMessage });
    }
  }]);
  return ShopifySectionsManager;
}();

/* harmony default export */ var shopify_sections_manager_es = (ShopifySectionsManager);

// EXTERNAL MODULE: ./node_modules/intersection-observer/intersection-observer.js
var intersection_observer = __webpack_require__(337);
;// CONCATENATED MODULE: ./node_modules/@pixelunion/rimg/dist/index.es.js
/*!
 * @pixelunion/rimg v2.2.0
 * (c) 2019 Pixel Union
 */
/**
 * The default template render function. Turns a template string into an image
 * URL.
 *
 * @param {String} template
 * @param {Size} size
 * @returns {String}
 */
function defaultTemplateRender(template, size) {
  return template.replace('{size}', size.width + 'x' + size.height);
}

/**
 * @type Settings
 */
var defaults = {
  scale: 1,
  template: false,
  templateRender: defaultTemplateRender,
  max: { width: Infinity, height: Infinity },
  round: 32,
  placeholder: false,
  crop: null
};

/**
 * Get a data attribute value from an element, with a default fallback and
 * sanitization step.
 *
 * @param {Element} el
 *
 * @param {String} name
 *        The data attribute name.
 *
 * @param {Object} options
 *        An object holding fallback values if the data attribute does not
 *        exist. If this object doesn't have the property, we further fallback
 *        to our defaults.
 *
 * @param {Function} [sanitize]
 *        A function to sanitize the data attribute value with.
 *
 * @returns {String|*}
 */
function getData(el, name, options, sanitize) {
  var attr = 'data-rimg-' + name;
  if (!el.hasAttribute(attr)) return options[name] || defaults[name];

  var value = el.getAttribute(attr);

  return sanitize ? sanitize(value) : value;
}

/**
 * Sanitize data attributes that represent a size (in the form of `10x10`).
 *
 * @param {String} value
 * @returns {Object} An object with `width` and `height` properties.
 */
function parseSize(value) {
  value = value.split('x');
  return { width: parseInt(value[0], 10), height: parseInt(value[1], 10) };
}

/**
 * Sanitize crop values to ensure they are valid, or null
 *
 * @param {String} value
 * @returns {Object} Shopify crop parameter ('top', 'center', 'bottom', 'left', 'right') or null, if an unsupported value is found
 */
function processCropValue(value) {
  switch (value) {
    case 'top':
    case 'center':
    case 'bottom':
    case 'left':
    case 'right':
      return value;
    default:
      return null;
  }
}

/**
 * Loads information about an element.
 *
 * Options can be set on the element itself using data attributes, or through
 * the `options` parameter. Data attributes take priority.
 *
 * @param {HTMLElement} el
 * @param {Settings} options
 * @returns {Item}
 */
function parseItem(el) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var isImage = el.hasAttribute('data-rimg-template');

  /**
   * @typedef {Settings} Item
   */
  return {
    el: el,

    // Type of element
    isImage: isImage,
    isBackgroundImage: isImage && el.tagName !== 'IMG',

    // Image scale
    scale: getData(el, 'scale', options),

    // Device density
    density: window.devicePixelRatio || 1,

    // Image template URL
    template: getData(el, 'template', options),
    templateRender: options.templateRender || defaults.templateRender,

    // Maximum image dimensions
    max: getData(el, 'max', options, parseSize),

    // Round image dimensions to the nearest multiple
    round: getData(el, 'round', options),

    // Placeholder image dimensions
    placeholder: getData(el, 'placeholder', options, parseSize),

    // Crop value; null if image is uncropped, otherwise equal to the Shopify crop parameter ('center', 'top', etc.)
    crop: getData(el, 'crop', options, processCropValue)
  };
}

/**
 * Round to the nearest multiple.
 *
 * This is so we don't tax the image server too much.
 *
 * @param {Number} size The size, in pixels.
 * @param {Number} [multiple] The multiple to round to the nearest.
 * @param {Number} [maxLimit] Maximum allowed value - value to return if rounded multiple is above this limit
 * @returns {Number}
 */
function roundSize(size) {
  var multiple = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 32;
  var maxLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;

  return size === 0 ? multiple : Math.min(Math.ceil(size / multiple) * multiple, maxLimit);
}

/**
 * Get the size of an element.
 *
 * If it is too small, it's parent element is checked, and so on. This helps
 * avoid the situation where an element doesn't have a size yet or is positioned
 * out of the layout.
 *
 * @param {HTMLElement} el
 * @return {Object} size
 * @return {Number} size.width The width, in pixels.
 * @return {Number} size.height The height, in pixels.
 */
function getElementSize(el) {
  var size = { width: 0, height: 0 };

  while (el) {
    size.width = el.offsetWidth;
    size.height = el.offsetHeight;
    if (size.width > 20 && size.height > 20) break;
    el = el.parentNode;
  }

  return size;
}

/**
 * Trigger a custom event.
 *
 * Note: this approach is deprecated, but still required to support older
 * browsers such as IE 10.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
 *
 * @param {HTMLElement} el
 *        The element to trigger the event on.
 *
 * @param {String} name
 *        The event name.
 *
 * @returns {Boolean}
 *          True if the event was canceled.
 */
function trigger(el, name) {
  var event = document.createEvent('Event');
  event.initEvent(name, true, true);
  return !el.dispatchEvent(event);
}

/**
 * Return the maximum supported density of the image, given the container.
 *
 * @param {Item} item
 * @param {Size} size
 */
function supportedDensity(item, size) {
  return Math.min(Math.min(Math.max(item.max.width / size.width, 1), item.density), Math.min(Math.max(item.max.height / size.height, 1), item.density)).toFixed(2);
}

/**
 * Set the image URL on the element. Supports background images and `srcset`.
 *
 * @param {Item} item
 * @param {Size} size
 * @param {Boolean} isPlaceholder
 */
function setImage(item, size, isPlaceholder, onLoad) {
  var render = item.templateRender;
  var density = isPlaceholder ? 1 : supportedDensity(item, size);
  var round = isPlaceholder ? 1 : item.round;

  // Calculate the final display size, taking into account the image's
  // maximum dimensions.
  var targetWidth = size.width * density;
  var targetHeight = size.height * density;

  var displaySize = void 0;

  if (item.crop) {
    displaySize = {
      width: roundSize(targetWidth, round, item.max.width),
      height: roundSize(targetHeight, round, item.max.height)
    };
  } else {
    // Shopify serves images clamped by the requested dimensions (fitted to the smallest dimension).
    // To get the desired and expected pixel density we need to request cover dimensions (fitted to largest dimension).
    // This isn't a problem with cropped images which are served at the exact dimension requested.
    var containerAspectRatio = size.width / size.height;
    var imageAspectRatio = item.max.width / item.max.height;

    if (containerAspectRatio > imageAspectRatio) {
      // fit width
      displaySize = {
        width: roundSize(targetWidth, round, item.max.width),
        height: roundSize(targetWidth / imageAspectRatio, round, item.max.height)
      };
    } else {
      // fit height
      displaySize = {
        width: roundSize(targetHeight * imageAspectRatio, round, item.max.width),
        height: roundSize(targetHeight, round, item.max.height)
      };
    }
  }

  var url = render(item.template, displaySize);

  // On load callback
  var image = new Image();
  image.onload = onLoad;
  image.src = url;

  // Set image
  if (item.isBackgroundImage) {
    item.el.style.backgroundImage = 'url(\'' + url + '\')';
  } else {
    item.el.setAttribute('srcset', url + ' ' + density + 'x');
  }
}

/**
 * Load the image, set loaded status, and trigger the load event.
 *
 * @fires rimg:load
 * @fires rimg:error
 * @param {Item} item
 * @param {Size} size
 */
function loadFullImage(item, size) {
  var el = item.el;

  setImage(item, size, false, function (event) {
    if (event.type === 'load') {
      el.setAttribute('data-rimg', 'loaded');
    } else {
      el.setAttribute('data-rimg', 'error');
      trigger(el, 'rimg:error');
    }

    trigger(el, 'rimg:load');
  });
}

/**
 * Load in a responsive image.
 *
 * Sets the image's `srcset` attribute to the final image URLs, calculated based
 * on the actual size the image is being shown at.
 *
 * @fires rimg:loading
 *        The image URLs have been set and we are waiting for them to load.
 *
 * @fires rimg:loaded
 *        The final image has loaded.
 *
 * @fires rimg:error
 *        The final image failed loading.
 *
 * @param {Item} item
 */
function loadImage(item) {
  var el = item.el;

  // Already loaded?
  var status = el.getAttribute('data-rimg');
  if (status === 'loading' || status === 'loaded') return;

  // Is the SVG loaded?
  // In Firefox, el.complete always returns true so we also check el.naturalWidth,
  // which equals 0 until the image loads
  if (el.naturalWidth == 0 && el.complete && !item.isBackgroundImage) {
    // Wait for the load event, then call load image
    el.addEventListener('load', function cb() {
      el.removeEventListener('load', cb);
      loadImage(item);
    });

    return;
  }

  // Trigger loading event, and stop if cancelled
  if (trigger(el, 'rimg:loading')) return;

  // Mark as loading
  el.setAttribute('data-rimg', 'loading');

  // Get element size. This is used as the ideal display size.
  var size = getElementSize(item.el);

  size.width *= item.scale;
  size.height *= item.scale;

  if (item.placeholder) {
    // Load a placeholder image first, followed by the full image. Force the
    // element to keep its dimensions while it loads. If the image is smaller
    // than the element size, use the image's size. Density is taken into account
    // for HiDPI devices to avoid blurry images.
    if (!item.isBackgroundImage) {
      el.setAttribute('width', Math.min(Math.floor(item.max.width / item.density), size.width));
      el.setAttribute('height', Math.min(Math.floor(item.max.height / item.density), size.height));
    }

    setImage(item, item.placeholder, true, function () {
      return loadFullImage(item, size);
    });
  } else {
    loadFullImage(item, size);
  }
}

/**
 * Prepare an element to be displayed on the screen.
 *
 * Images have special logic applied to them to swap out the different sources.
 *
 * @fires rimg:enter
 *        The element is entering the viewport.
 *
 * @param {HTMLElement} el
 * @param {Settings} options
 */
function load(el, options) {
  if (!el) return;
  trigger(el, 'rimg:enter');

  var item = parseItem(el, options);

  if (item.isImage) {
    if (!item.isBackgroundImage) {
      el.setAttribute('data-rimg-template-svg', el.getAttribute('srcset'));
    }

    loadImage(item);
  }
}

/**
 * Reset an element's state so that its image can be recalculated.
 *
 * @fires rimg:update
 *        The element is being updated.
 *
 * @param {HTMLElement} el
 * @param {Settings} options
 */
function update(el, options) {
  if (!el) return;
  trigger(el, 'rimg:update');

  var item = parseItem(el, options);

  if (item.isImage) {
    if (!item.isBackgroundImage) {
      el.setAttribute('data-rimg', 'lazy');
      el.setAttribute('srcset', el.getAttribute('data-rimg-template-svg'));
    }

    loadImage(item);
  }
}

/**
 * Returns true if the element is within the viewport.
 * @param {HTMLElement} el
 * @returns {Boolean}
 */
function inViewport(el) {
  if (!el.offsetWidth || !el.offsetHeight || !el.getClientRects().length) {
    return false;
  }

  var root = document.documentElement;
  var width = Math.min(root.clientWidth, window.innerWidth);
  var height = Math.min(root.clientHeight, window.innerHeight);
  var rect = el.getBoundingClientRect();

  return rect.bottom >= 0 && rect.right >= 0 && rect.top <= height && rect.left <= width;
}

/**
 * @typedef {Object} Size
 * @property {Number} width
 * @property {Number} height
 */

/**
 * A function to turn a template string into a URL.
 *
 * @callback TemplateRenderer
 * @param {String} template
 * @param {Size} size
 * @returns {String}
 */

/**
 * @typedef {Object} Settings
 *
 * @property {String} [template]
 *           A template string used to generate URLs for an image. This allows us to
 *           dynamically load images with sizes to match the container's size.
 *
 * @property {TemplateRenderer} [templateRender]
 *           A function to turn a template string into a URL.
 *
 * @property {Size} [max]
 *           The maximum available size for the image. This ensures we don't
 *           try to load an image larger than is possible.
 * 
 * @property {Number} [scale]
 *           A number to scale the final image dimensions by. 
 *           Only applies to lazy-loaded images. Defaults to 1.
 *
 * @property {Number} [round]
 *           Round image dimensions to the nearest multiple. This is intended to
 *           tax the image server less by lowering the number of possible image
 *           sizes requested.
 *
 * @property {Size} [placeholder]
 *           The size of the lo-fi image to load before the full image.
 * 
 * @property {String} [crop]
 *           Crop value; null if image is uncropped, otherwise equal 
 *           to the Shopify crop parameter ('center', 'top', etc.).
 */

/**
 * Initialize the responsive image handler.
 *
 * @param {String|HTMLElement|NodeList} selector
 *        The CSS selector, element, or elements to track for lazy-loading.
 *
 * @param {Settings} options
 *
 * @returns {PublicApi}
 */
function rimg() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg="lazy"]';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Intersections
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        io.unobserve(entry.target);
        load(entry.target, options);
      }
    });
  }, {
    // Watch the viewport, with 20% vertical margins
    rootMargin: '20% 0px'
  });

  /**
   * @typedef {Object} PublicApi
   */
  var api = {
    /**
     * Track a new selector, element, or nodelist for lazy-loading.
     * @type Function
     * @param {String|HTMLElement|NodeList} selector
     */
    track: function track() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg="lazy"]';

      var els = querySelector(selector);

      for (var i = 0; i < els.length; i++) {
        // If an element is already in the viewport, load it right away. This
        // fixes a race-condition with dynamically added elements.
        if (inViewport(els[i])) {
          load(els[i], options);
        } else {
          io.observe(els[i]);
        }
      }
    },


    /**
     * Update element(s) that have already been loaded to force their images
     * to be recalculated.
     * @type Function
     * @param {String|HTMLElement|NodeList} selector
     */
    update: function update$$1() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg="loaded"]';

      var els = querySelector(selector);
      for (var i = 0; i < els.length; i++) {
        update(els[i], options);
      }
    },


    /**
     * Stop tracking element(s) for lazy-loading.
     * @type Function
     * @param {String|HTMLElement|NodeList} selector
     */
    untrack: function untrack() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg]';

      var els = querySelector(selector);
      for (var i = 0; i < els.length; i++) {
        io.unobserve(els[i]);
      }
    },


    /**
     * Manually load images.
     * @type Function
     * @param {String|HTMLElement|NodeList} selector
     */
    load: function load$$1() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg]';

      var els = querySelector(selector);
      for (var i = 0; i < els.length; i++) {
        load(els[i], options);
      }
    },


    /**
     * Unload all event handlers and observers.
     * @type Function
     */
    unload: function unload() {
      io.disconnect();
    }
  };

  // Add initial elements
  api.track(selector);

  return api;
}

/**
 * Finds a group of elements on the page.
 *
 * @param {String|HTMLElement|NodeList} selector
 * @returns {Object} An array-like object.
 */
function querySelector(selector) {
  if (typeof selector === 'string') {
    return document.querySelectorAll(selector);
  }

  if (selector instanceof HTMLElement) {
    return [selector];
  }

  if (selector instanceof NodeList) {
    return selector;
  }

  return [];
}

/* harmony default export */ var index_es = (rimg);

;// CONCATENATED MODULE: ./node_modules/@pixelunion/rimg-shopify/dist/index.es.js
/*!
 * @pixelunion/rimg-shopify v2.5.2
 * (c) 2020 Pixel Union
 */


/**
 * Polyfill for Element.matches().
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
 */
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;

    while (--i >= 0 && matches.item(i) !== this) {}

    return i > -1;
  };
}

var state = {
  init: init,
  watch: watch,
  unwatch: unwatch,
  load: index_es_load
};

function init() {
  var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-rimg="lazy"]';
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  state.selector = selector;
  state.instance = index_es(selector, options);
  state.loadedWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); // Listen for Shopify theme editor events

  document.addEventListener('shopify:section:load', function (event) {
    return watch(event.target);
  });
  window.addEventListener('resize', function () {
    return _update();
  });
  document.addEventListener('shopify:section:unload', function (event) {
    return unwatch(event.target);
  }); // Listen for custom events to allow themes to hook into rimg

  document.addEventListener('theme:rimg:watch', function (event) {
    return watch(event.target);
  });
  document.addEventListener('theme:rimg:unwatch', function (event) {
    return unwatch(event.target);
  }); // Support custom events triggered through jQuery
  // See: https://github.com/jquery/jquery/issues/3347

  if (window.jQuery) {
    jQuery(document).on({
      'theme:rimg:watch': function themeRimgWatch(event) {
        return watch(event.target);
      },
      'theme:rimg:unwatch': function themeRimgUnwatch(event) {
        return unwatch(event.target);
      }
    });
  }
}
/**
 * Track an element, and its children.
 *
 * @param {HTMLElement} el
 */


function watch(el) {
  // Track element
  if (typeof el.matches === 'function' && el.matches(state.selector)) {
    state.instance.track(el);
  } // Track element's children


  state.instance.track(el.querySelectorAll(state.selector));
}
/**
 * Untrack an element, and its children
 *
 * @param {HTMLElement} el
 * @private
 */


function unwatch(el) {
  // Untrack element's children
  state.instance.untrack(el.querySelectorAll(state.selector)); // Untrack element

  if (typeof el.matches === 'function' && el.matches(state.selector)) {
    state.instance.untrack(el);
  }
}
/**
 * Manually load an image
 *
 * @param {HTMLElement} el
 */


function index_es_load(el) {
  // Load element
  if (typeof el.matches === 'function' && el.matches(state.selector)) {
    state.instance.load(el);
  } // Load element's children


  state.instance.load(el.querySelectorAll(state.selector));
}
/**
 * Update an element, and its children.
 *
 * @param {HTMLElement} el
 */


function _update() {
  var currentWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0); // Return if we're not 2x smaller, or larger than the existing loading size

  if (currentWidth / state.loadedWidth > 0.5 && currentWidth / state.loadedWidth < 2) {
    return;
  }

  state.loadedWidth = currentWidth;
  state.instance.update();
}

/* harmony default export */ var dist_index_es = (state);

// EXTERNAL MODULE: ./node_modules/scriptjs/dist/script.js
var script = __webpack_require__(277);
var script_default = /*#__PURE__*/__webpack_require__.n(script);
;// CONCATENATED MODULE: ./node_modules/@pixelunion/pxs-map/dist/index.es.js

/*!
 * @pixelunion/pxs-map v2.1.0
 * (c) 2021 Pixel Union
 */



function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/*
 * Function to convert any given latitude and longitude format to decimal degrees
 */
function getDecimalDegrees() {
  var firstComponent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var secondComponent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var thirdComponent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var fourthComponent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var directions = {
    N: 1,
    E: 1,
    S: -1,
    W: -1
  };
  var decimalDegrees = 0.0;
  var components = [firstComponent, secondComponent, thirdComponent, fourthComponent];

  for (var i = 0; i < components.length; i++) {
    var component = components[i];

    if (component) {
      if (Number.isNaN(parseFloat(component))) {
        decimalDegrees *= directions[component];
      } else {
        decimalDegrees += parseFloat(component) / Math.pow(60, i);
      }
    }
  }

  return decimalDegrees;
}
/*
 * By providing the ability to use a place name, or latitude and longitude coordinates
 * we give merchants, and our demo stores the option to bypass the Geocoding API.
 * The Geocoding API (https://developers.google.com/maps/documentation/geocoding/usage-and-billing) allows us
 * to take a place name and convert it to latitude and longitude expressed in decimal degrees.
 */


function getLatitudeLongitude(address) {
  // Degrees, Minutes and Seconds: DDD° MM' SS.S"
  var latLongDegreesMinutesSeconds = /^([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2})(?:'[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:"[ ]?| )?(N|E|S|W) ?([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2})(?:'[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:"[ ]?| )?(N|E|S|W)$/g; // Degrees and Decimal Minutes: DDD° MM.MMM'

  var latLongDegreesMinutes = /^([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:'[ ]?| )?(N|E|S|W) ?([0-9]{1,3})(?:°[ ]?| )([0-9]{1,2}(?:\.[0-9]+)?)(?:'[ ]?| )?(N|E|S|W)$/g; // Decimal Degrees: DDD.DDDDD°

  var latLongDegrees = /^([-|+]?[0-9]{1,3}(?:\.[0-9]+)?)(?:°[ ]?| )?(N|E|S|W)?,? ?([-|+]?[0-9]{1,3}(?:\.[0-9]+)?)(?:°[ ]?| )?(N|E|S|W)?$/g;
  var latLongFormats = [latLongDegreesMinutesSeconds, latLongDegreesMinutes, latLongDegrees];
  var latLongMatches = latLongFormats.map(function (latLongFormat) {
    return address.match(latLongFormat);
  });
  /*
   * Select the first latitude and longitude format that is matched.
   * Ordering:
   *   1. Degrees, minutes, and seconds,
   *   2. Degrees, and decimal minutes,
   *   3. Decimal degrees.
   */

  var latLongMatch = latLongMatches.reduce(function (accumulator, value, index) {
    if (!accumulator && value) {
      var latLongResult = latLongFormats[index].exec(address);
      var lat = latLongResult.slice(1, latLongResult.length / 2 + 1);
      var lng = latLongResult.slice(latLongResult.length / 2 + 1, latLongResult.length);
      return {
        lat: lat,
        lng: lng
      };
    }

    return accumulator;
  }, null);
  return new Promise(function (resolve, reject) {
    // If we've got a match on latitude and longitude, use that and avoid geocoding
    if (latLongMatch) {
      var latDecimalDegrees = getDecimalDegrees.apply(void 0, _toConsumableArray(latLongMatch.lat));
      var longDecimalDegrees = getDecimalDegrees.apply(void 0, _toConsumableArray(latLongMatch.lng));
      resolve({
        lat: latDecimalDegrees,
        lng: longDecimalDegrees
      });
    } else {
      // Otherwise, geocode the assumed address
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        address: address
      }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK || !results[0]) {
          reject(status);
        } else {
          resolve(results[0].geometry.location);
        }
      });
    }
  });
}

function getMapStyles(colors) {
  if (!colors) {
    return [];
  }

  return [{
    elementType: 'geometry',
    stylers: [{
      color: colors.e
    }]
  }, {
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    elementType: 'labels.text.fill',
    stylers: [{
      color: colors.a
    }]
  }, {
    elementType: 'labels.text.stroke',
    stylers: [{
      color: colors.e
    }]
  }, {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.country',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.land_parcel',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.neighborhood',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'administrative.locality',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'poi',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{
      color: colors.d
    }]
  }, {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{
      color: colors.c
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{
      color: colors.b
    }]
  }, {
    featureType: 'road.highway.controlled_access',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [{
      color: colors.b
    }]
  }, {
    featureType: 'road.local',
    elementType: 'labels.text.stroke',
    stylers: [{
      color: colors.e
    }]
  }, {
    featureType: 'transit',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{
      color: colors.f
    }]
  }];
}

function createMap(options) {
  var container = options.container,
      address = options.address,
      zoom = options.zoom,
      colors = options.colors;
  return getLatitudeLongitude(address).then(function (latLong) {
    var map = new google.maps.Map(container, {
      center: latLong,
      clickableIcons: false,
      disableDefaultUI: true,
      disableDoubleClickZoom: true,
      gestureHandling: 'none',
      keyboardShortcuts: false,
      maxZoom: zoom,
      minZoom: zoom,
      scrollWheel: false,
      styles: getMapStyles(colors),
      zoom: zoom,
      zoomControl: false
    });
    new google.maps.Marker({
      clickable: false,
      map: map,
      position: map.getCenter()
    });
    map.panBy(0, 0);
  })["catch"](function (status) {
    var usageLimits = 'https://developers.google.com/maps/faq#usagelimits';
    var errorMessage;

    switch (status) {
      case 'ZERO_RESULTS':
        errorMessage = "<p>Unable to find the address:</p> ".concat(address);
        break;

      case 'OVER_QUERY_LIMIT':
        errorMessage = "\n            <p>Unable to load Google Maps, you have reached your usage limit.</p>\n            <p>\n              Please visit\n              <a href=\"".concat(usageLimits, "\" target=\"_blank\">").concat(usageLimits, "</a>\n              for more details.\n            </p>\n          ");
        break;

      default:
        errorMessage = 'Unable to load Google Maps.';
        break;
    }

    throw errorMessage;
  });
}

function displayErrorInThemeEditor(container, errorMessage) {
  var isThemeEditor = window.Shopify && window.Shopify.designMode;

  if (!isThemeEditor) {
    return;
  }

  container.innerHTML = "<div class=\"map-error-message\">".concat(errorMessage, "</div>");
}

var PxsMap = function PxsMap(section) {
  var _this = this;

  _classCallCheck(this, PxsMap);

  this.map = null;
  var el = section.el.querySelector('[data-map]');
  var container = el.querySelector('[data-map-container]');
  var settings = section.data;
  var address = settings.address,
      colors = settings.colors;
  var apiKey = settings.api_key; // Scale so range is 12 ~ 17, rather than 1 to 6

  var zoom = Number.isNaN(settings.zoom) ? 13 : 11 + parseInt(settings.zoom, 10);

  if (apiKey) {
    if (window.googleMaps === undefined) {
      script_default()("https://maps.googleapis.com/maps/api/js?key=".concat(apiKey), function () {
        window.googleMaps = true;
        createMap({
          container: container,
          address: address,
          zoom: zoom,
          colors: colors
        }).then(function (map) {
          _this.map = map;
        })["catch"](function (error) {
          return displayErrorInThemeEditor(container, error);
        });
      });
    } else {
      createMap({
        container: container,
        address: address,
        zoom: zoom,
        colors: colors
      }).then(function (map) {
        _this.map = map;
      })["catch"](function (error) {
        return displayErrorInThemeEditor(container, error);
      });
    }
  }
};

/* harmony default export */ var pxs_map_dist_index_es = (PxsMap);

// EXTERNAL MODULE: ./source/scripts/helpers/polyfill-nodelist-foreach.js
var polyfill_nodelist_foreach = __webpack_require__(554);
;// CONCATENATED MODULE: ./source/scripts/helpers/FlickityTouchFix.js
// This is a helper class to fix a touch issue that came up in flickity
// on iOS devices as of version 13. It should smooth out some of the scroll
// and swipe issues that flickity is having on that version of iOS.
var flickityTouchFix = function flickityTouchFix() {
  var touchingSlider = false;
  var touchStartCoordsX = 0;

  var onTouchStart = function onTouchStart(e) {
    if (e.target.closest && e.target.closest('.flickity-slider')) {
      touchingSlider = true;
      touchStartCoordsX = e.touches[0].pageX;
    } else {
      touchingSlider = false;
    }
  };

  var onTouchMove = function onTouchMove(e) {
    if (!(touchingSlider && e.cancelable)) {
      return;
    }

    if (Math.abs(e.touches[0].pageX - touchStartCoordsX) > 10) {
      e.preventDefault();
    }
  };

  document.body.addEventListener('touchstart', onTouchStart);
  document.body.addEventListener('touchmove', onTouchMove, {
    passive: false
  });
};

/* harmony default export */ var FlickityTouchFix = (flickityTouchFix);
;// CONCATENATED MODULE: ./source/scripts/templates/TemplateAccount.js
function TemplateAccount_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TemplateAccount = /*#__PURE__*/function () {
  function TemplateAccount(_ref) {
    var _this = this;

    var el = _ref.el;

    TemplateAccount_classCallCheck(this, TemplateAccount);

    this.el = el;
    var deleteAddressEls = this.el.querySelectorAll('.delete-address');
    var editAddressEls = this.el.querySelectorAll('.edit-address');
    var addNewAddressEl = this.el.querySelector('.add-new-address');
    var toggleForgetfulnessEl = this.el.querySelector('.toggle-forgetfulness');
    var addressCountryEl = this.el.querySelector('.address-country');

    if (deleteAddressEls.length) {
      deleteAddressEls.forEach(function (deleteAddressEl) {
        return deleteAddressEl.addEventListener('click', function (event) {
          return _this.deleteAddress(event);
        });
      });
    }

    if (editAddressEls.length) {
      editAddressEls.forEach(function (editAddressEl) {
        return editAddressEl.addEventListener('click', function (event) {
          return _this.editAddress(event);
        });
      });
    }

    if (addNewAddressEl) {
      addNewAddressEl.addEventListener('click', function () {
        return _this.addNewAddress();
      });
    }

    if (toggleForgetfulnessEl) {
      toggleForgetfulnessEl.addEventListener('click', function () {
        return _this.recoverPassword();
      });
    }

    if (addressCountryEl) {
      addressCountryEl.addEventListener('change', function () {
        return _this.updateProvinceSelectText();
      });
    }

    if (this.el.classList.contains('template-customers-addresses')) {
      this.prepareAddresses();
    }

    if (this.el.classList.contains('template-customers-login')) {
      this.checkForReset();
    }

    if (window.location.hash === '#recover') {
      return this.recoverPassword();
    }
  }

  _createClass(TemplateAccount, [{
    key: "recoverPassword",
    value: function recoverPassword() {
      this.el.querySelector('.recover-password').classList.toggle('visible');
      this.el.querySelector('.customer-login').classList.toggle('visible');
    }
  }, {
    key: "checkForReset",
    value: function checkForReset() {
      if ('sucessfulReset' in this.el.querySelector('.reset-check').dataset) {
        this.el.querySelector('.successful-reset').classList.add('visible');
      }
    }
  }, {
    key: "prepareAddresses",
    value: function prepareAddresses() {
      new Shopify.CountryProvinceSelector('address-country', 'address-province', {
        hideElement: 'address-province-container'
      });
      var addresses = this.el.querySelectorAll('.customer-address');
      addresses.forEach(function (address) {
        var addressID = address.dataset.addressId;
        new Shopify.CountryProvinceSelector("address-country-".concat(addressID), "address-province-".concat(addressID), {
          hideElement: "address-province-container-".concat(addressID)
        });
      });
    }
  }, {
    key: "deleteAddress",
    value: function deleteAddress(e) {
      var addressID = e.target.closest('[data-address-id]').dataset.addressId;
      Shopify.CustomerAddress.destroy(addressID);
    }
  }, {
    key: "editAddress",
    value: function editAddress(e) {
      var addressID = e.target.closest('[data-address-id]').dataset.addressId;
      this.el.querySelector('.customer-address').classList.remove('editing');
      this.el.querySelector('.customer-address').querySelector('.edit-address').classList.remove('disabled');
      this.el.querySelector(".customer-address[data-address-id='".concat(addressID, "']")).classList.add('editing');
      this.el.querySelector(".customer-address[data-address-id='".concat(addressID, "']")).querySelector('.edit-address').classList.add('disabled');
      this.el.querySelector('.customer-address-edit-form, .customer-new-address').classList.add('hidden');
      this.el.querySelector(".customer-address-edit-form[data-address-id='".concat(addressID, "']")).classList.remove('hidden');
    }
  }, {
    key: "addNewAddress",
    value: function addNewAddress() {
      this.el.querySelector('.customer-address').classList.remove('editing');
      this.el.querySelector('.customer-address').querySelector('.edit-address').classList.remove('disabled');
      this.el.querySelector('.customer-address-edit-form').classList.add('hidden');
      this.el.querySelector('.customer-new-address').classList.remove('hidden');
    }
  }, {
    key: "updateProvinceSelectText",
    value: function updateProvinceSelectText() {
      this.el.querySelector('.address-province').previousElementSibling.innerText = "-- ".concat(window.Theme.pleaseSelectText, " --");
    }
  }]);

  return TemplateAccount;
}();


;// CONCATENATED MODULE: ./source/scripts/templates/TemplateLogin.js
function TemplateLogin_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function TemplateLogin_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function TemplateLogin_createClass(Constructor, protoProps, staticProps) { if (protoProps) TemplateLogin_defineProperties(Constructor.prototype, protoProps); if (staticProps) TemplateLogin_defineProperties(Constructor, staticProps); return Constructor; }

var TemplateLogin = /*#__PURE__*/function () {
  function TemplateLogin() {
    var _this = this;

    TemplateLogin_classCallCheck(this, TemplateLogin);

    document.body.addEventListener('click', function (event) {
      return _this.closeModal(event);
    });
    document.querySelector('.admin-login-modal').addEventListener('click', function () {
      return _this.openModal();
    });
    this.modalWrapper = document.querySelector('.password-page-modal-wrapper');
    this.modalContent = this.modalWrapper.querySelector('.password-page-modal');

    if (this.modalWrapper.querySelector('[data-open-modal]')) {
      this.openModal();
    }

    window.addEventListener('resize', function () {
      return _this.positionModal();
    });
  }

  TemplateLogin_createClass(TemplateLogin, [{
    key: "closeModal",
    value: function closeModal(e) {
      if (e.target.classList.contains('visible')) {
        this.modalWrapper.classList.remove('visible');
        this.modalWrapper.addEventListener('transitionend', function () {
          document.body.classList.remove('scroll-locked');
        });
      }
    }
  }, {
    key: "openModal",
    value: function openModal() {
      document.body.classList.add('scroll-locked');
      this.positionModal();
      this.modalWrapper.classList.add('visible');
    }
  }, {
    key: "positionModal",
    value: function positionModal() {
      var _this$modalContent$ge = this.modalContent.getBoundingClientRect(),
          width = _this$modalContent$ge.width,
          height = _this$modalContent$ge.height;

      this.modalContent.style.marginTop = -(height / 2);
      this.modalContent.style.marginLeft = -(width / 2);
    }
  }]);

  return TemplateLogin;
}();


;// CONCATENATED MODULE: ./source/scripts/templates/TemplateGiftCard.js
function TemplateGiftCard_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function TemplateGiftCard_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function TemplateGiftCard_createClass(Constructor, protoProps, staticProps) { if (protoProps) TemplateGiftCard_defineProperties(Constructor.prototype, protoProps); if (staticProps) TemplateGiftCard_defineProperties(Constructor, staticProps); return Constructor; }

var TemplateGiftCard = /*#__PURE__*/function () {
  function TemplateGiftCard() {
    TemplateGiftCard_classCallCheck(this, TemplateGiftCard);

    return this.addQrCode();
  }

  TemplateGiftCard_createClass(TemplateGiftCard, [{
    key: "addQrCode",
    value: function addQrCode() {
      var qrWrapper = document.querySelector('[data-qr-code]');
      return new QRCode(qrWrapper, {
        text: qrWrapper.dataset.qrCode,
        width: 120,
        height: 120
      });
    }
  }]);

  return TemplateGiftCard;
}();


// EXTERNAL MODULE: ./node_modules/@pixelunion/grouped-content/dist/index.js
var dist = __webpack_require__(263);
var dist_default = /*#__PURE__*/__webpack_require__.n(dist);
;// CONCATENATED MODULE: ./node_modules/reframe.js/dist/reframe.es.js
function reframe(target, cName) {
  var frames = typeof target === 'string' ? document.querySelectorAll(target) : target;
  var c = cName || 'js-reframe';
  if (!('length' in frames)) frames = [frames];
  for (var i = 0; i < frames.length; i += 1) {
    var frame = frames[i];
    var hasClass = frame.className.split(' ').indexOf(c) !== -1;
    if (hasClass || frame.style.width.indexOf('%') > -1) continue;
    var h = frame.getAttribute('height') || frame.offsetHeight;
    var w = frame.getAttribute('width') || frame.offsetWidth;
    var padding = h / w * 100;
    var div = document.createElement('div');
    div.className = c;
    var divStyles = div.style;
    divStyles.position = 'relative';
    divStyles.width = '100%';
    divStyles.paddingTop = padding + "%";
    var frameStyle = frame.style;
    frameStyle.position = 'absolute';
    frameStyle.width = '100%';
    frameStyle.height = '100%';
    frameStyle.left = '0';
    frameStyle.top = '0';
    frame.parentNode.insertBefore(div, frame);
    frame.parentNode.removeChild(frame);
    div.appendChild(frame);
  }
}

/* harmony default export */ var reframe_es = (reframe);

;// CONCATENATED MODULE: ./source/scripts/components/RTE.js
function RTE_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function RTE_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function RTE_createClass(Constructor, protoProps, staticProps) { if (protoProps) RTE_defineProperties(Constructor.prototype, protoProps); if (staticProps) RTE_defineProperties(Constructor, staticProps); return Constructor; }




var RTE = /*#__PURE__*/function () {
  function RTE(component) {
    RTE_classCallCheck(this, RTE);

    this.el = component.el;
    this.setupTabs();
    reframe_es(this.el.querySelectorAll('iframe'));
    var videos = this.el.querySelectorAll('iframe');

    for (var i = 0; i < videos.length; i++) {
      var video = videos[i];

      if (video.classList.contains('highlight')) {
        video.parentNode.classList.add('highlight');
      }
    }
  }

  RTE_createClass(RTE, [{
    key: "setupTabs",
    value: function setupTabs() {
      return new (dist_default())(this.el, {
        layout: 'tabs',
        intelliparse: false
      });
    }
  }]);

  return RTE;
}();


;// CONCATENATED MODULE: ./source/scripts/components/Select.js
function Select_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function updateSelect(select) {
  var selectedIndex = select.selectedIndex,
      options = select.options;
  if (selectedIndex < 0) return;
  var text = options[selectedIndex].text;

  if (text) {
    var sibling = select.parentNode.firstElementChild; // Loop through each sibling and push to the array

    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== select && (sibling.classList.contains('selected-text') || sibling.classList.contains('selected-option'))) {
        sibling.innerText = text;
      }

      sibling = sibling.nextElementSibling;
    }
  }
}

var Select = function Select(_ref) {
  var el = _ref.el;

  Select_classCallCheck(this, Select);

  var parentElement = el.parentElement;

  if (parentElement && !parentElement.classList.contains('select-wrapper') && !el.classList.contains('product-variants') && !el.classList.contains('select-disable-wrapper')) {
    var wrapperEl = document.createElement('div');
    var selectedTextEl = document.createElement('span');
    wrapperEl.classList.add('select-wrapper');
    selectedTextEl.classList.add('selected-text');
    wrapperEl.appendChild(selectedTextEl);
    parentElement.insertBefore(wrapperEl, el);
    wrapperEl.appendChild(el);
  }

  updateSelect(el);
  el.addEventListener('change', function (event) {
    return updateSelect(event.target);
  });
};


// EXTERNAL MODULE: ./node_modules/flickity/js/index.js
var js = __webpack_require__(442);
var js_default = /*#__PURE__*/__webpack_require__.n(js);
;// CONCATENATED MODULE: ./source/scripts/themeUtils.js
var themeUtils;
/* harmony default export */ var scripts_themeUtils = (themeUtils = {
  breakpoints: {
    small: 770,
    medium: 1080,
    large: 1280
  },
  extend: function extend(dest) {
    for (var i = 0; i < (arguments.length <= 1 ? 0 : arguments.length - 1); i++) {
      var obj = i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1];

      for (var k in obj) {
        var v = obj[k];
        dest[k] = v;
      }
    }

    return dest;
  },
  windowWidth: function windowWidth() {
    return window.innerWidth;
  },
  isLessThanMedium: function isLessThanMedium() {
    return this.windowWidth() < this.breakpoints.small;
  },
  isLessThanLarge: function isLessThanLarge() {
    return this.windowWidth() < this.breakpoints.medium;
  },
  isSmall: function isSmall() {
    return this.windowWidth() < this.breakpoints.small;
  },
  isMedium: function isMedium() {
    return this.windowWidth() >= this.breakpoints.small && this.windowWidth() < this.breakpoints.medium;
  },
  isLarge: function isLarge() {
    return this.windowWidth() >= this.breakpoints.medium;
  },
  debounce: function debounce(func, wait, immediate) {
    var timeout = null;
    return function () {
      var context = this;
      var args = arguments;

      var later = function later() {
        timeout = null;

        if (!immediate) {
          func.apply(context, args);
        }
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        func.apply(context, args);
      }
    };
  },
  unique: function unique(array) {
    var key;
    var asc;
    var end;
    var output = {};

    for (key = 0, end = array.length, asc = end >= 0; asc ? key < end : key > end; asc ? key++ : key--) {
      output[array[key]] = array[key];
    }

    return function () {
      var result = [];

      for (key in output) {
        var value = output[key];
        result.push(value);
      }

      return result;
    }();
  },
  inViewport: function inViewport(el, direction) {
    var viewportHeight;
    var viewportWidth;

    if (direction == null) {
      direction = 'both';
    }

    var rect = el.getBoundingClientRect();
    var style = el.currentStyle || window.getComputedStyle(el);
    var marginRight = parseInt(style.marginRight) || 0;
    var marginLeft = parseInt(style.marginLeft) || 0;

    if (document.documentElement.clientWidth < window.innerWidth) {
      viewportWidth = document.documentElement.clientWidth;
    } else {
      viewportWidth = window.innerWidth;
    }

    if (document.documentElement.clientHeight < window.innerHeight) {
      viewportHeight = document.documentElement.clientHeight;
    } else {
      viewportHeight = window.innerHeight;
    }

    var inViewportH = rect.right - marginRight >= 0 && rect.left - marginLeft <= viewportWidth;
    var inViewportV = rect.bottom >= 0 && rect.top <= viewportHeight;

    switch (direction) {
      case 'horizontal':
        return inViewportH;

      case 'vertical':
        return inViewportV;

      case 'both':
        return inViewportV && inViewportH;
    }
  },

  /*
        Resize Flickity slider to tallest cell in viewport
        */
  flickityResize: function flickityResize(flickity) {
    var viewport = flickity.viewport;
    var heights = [];

    for (var i = 0; i < flickity.cells.length; i++) {
      var cell = flickity.cells[i];

      if (this.inViewport(cell.element, 'horizontal')) {
        heights.push(cell.element.getBoundingClientRect().height);
      }
    }

    var height = Math.max.apply(null, heights);
    viewport.style.height = "".concat(height, "px");
  }
});
;// CONCATENATED MODULE: ./source/scripts/sections/DynamicBlog.js
function DynamicBlog_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DynamicBlog_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DynamicBlog_createClass(Constructor, protoProps, staticProps) { if (protoProps) DynamicBlog_defineProperties(Constructor.prototype, protoProps); if (staticProps) DynamicBlog_defineProperties(Constructor, staticProps); return Constructor; }




var DynamicBlog = /*#__PURE__*/function () {
  function DynamicBlog(section) {
    DynamicBlog_classCallCheck(this, DynamicBlog);

    this.container = 'data-blog-container';
    this.slide = '.home-blog-post';
    this.el = section.el;
    this.container = this.el.querySelector("[".concat(this.container, "]"));
    this.flickity = null;
    this._flickity = this._flickity.bind(this);

    this._bindEvents();

    this._flickity();
  }

  DynamicBlog_createClass(DynamicBlog, [{
    key: "_bindEvents",
    value: function _bindEvents() {
      window.addEventListener('resize', scripts_themeUtils.debounce(this._flickity, 100));
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      window.removeEventListener('resize', scripts_themeUtils.debounce(this._flickity, 100));

      this._destroyFlickity();
    }
  }, {
    key: "_flickity",
    value: function _flickity() {
      if (!this.container) return; // If larger than 'small', destroy Flickity and exit

      if (!scripts_themeUtils.isSmall()) {
        this._destroyFlickity();

        return;
      } // If Flickity is initialised, exit


      if (this.flickity) {
        return;
      }

      this.flickity = new (js_default())(this.container, {
        cellAlign: 'left',
        cellSelector: this.slide,
        contain: false,
        prevNextButtons: false,
        pageDots: false,
        setGallerySize: false
      });

      this._flickityEvents();
    }
  }, {
    key: "_destroyFlickity",
    value: function _destroyFlickity() {
      var _this = this;

      if (this.flickity) {
        this.flickity.destroy();
        this.flickity = null;
        window.removeEventListener('resize', scripts_themeUtils.debounce(function () {
          return scripts_themeUtils.flickityResize(_this.flickity);
        }, 10));
        this.container.removeEventListener('rimg:load', function () {
          return scripts_themeUtils.flickityResize(_this.flickity);
        });
      }
    }
  }, {
    key: "_flickityEvents",
    value: function _flickityEvents() {
      var _this2 = this;

      // Check for tallest slide at start of transition
      this.flickity.on('cellSelect', function () {
        return scripts_themeUtils.flickityResize(_this2.flickity);
      }); // Check for tallest slide at end of transition

      this.flickity.on('settle', function () {
        return scripts_themeUtils.flickityResize(_this2.flickity);
      });
      this.container.addEventListener('rimg:load', function () {
        return scripts_themeUtils.flickityResize(_this2.flickity);
      }); // Sets the Slider to the height of the first slide

      scripts_themeUtils.flickityResize(this.flickity);
      window.addEventListener('resize', scripts_themeUtils.debounce(function () {
        return scripts_themeUtils.flickityResize(_this2.flickity);
      }, 10));
    }
  }]);

  return DynamicBlog;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/DynamicCollectionsList.js
function DynamicCollectionsList_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DynamicCollectionsList_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DynamicCollectionsList_createClass(Constructor, protoProps, staticProps) { if (protoProps) DynamicCollectionsList_defineProperties(Constructor.prototype, protoProps); if (staticProps) DynamicCollectionsList_defineProperties(Constructor, staticProps); return Constructor; }



var DynamicCollectionsList = /*#__PURE__*/function () {
  function DynamicCollectionsList(section) {
    DynamicCollectionsList_classCallCheck(this, DynamicCollectionsList);

    this.el = section.el;
    this.initializedClass = 'collection-initialized';
    this.collectionsContainer = this.el.querySelector('[data-collections]');
    this.collectionHeight = this.el.querySelector('.home-collections').getBoundingClientRect().height;
    this._setupCollections = this._setupCollections.bind(this);

    this._bindEvents();

    this._setupCollections();
  }

  DynamicCollectionsList_createClass(DynamicCollectionsList, [{
    key: "onSectionLoad",
    value: function onSectionLoad() {
      this._bindEvents();

      this._setupCollections();
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this._unbindEvents();
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(event) {
      this._setupCollections();
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect(event) {
      this._setupCollections();
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this = this;

      document.querySelectorAll('.home-collection-overlay-wrapper').forEach(function (homeCollectionOverlayWrapper) {
        return homeCollectionOverlayWrapper.addEventListener('click', function (e) {
          return _this._redirectCollection(e);
        });
      });
      this.el.addEventListener('rimg:load', function () {
        return _this._setupCollections();
      });
      window.addEventListener('resize', scripts_themeUtils.debounce(this._setupCollections, 500));
    }
  }, {
    key: "_unbindEvents",
    value: function _unbindEvents() {
      var _this2 = this;

      document.querySelectorAll('.home-collection-overlay-wrapper').forEach(function (homeCollectionOverlayWrapper) {
        return homeCollectionOverlayWrapper.removeEventListener('click', function (e) {
          return _this2._redirectCollection(e);
        });
      });
      this.el.removeEventListener('rimg:load', function () {
        return _this2._setupCollections();
      });
      window.removeEventListener('resize', scripts_themeUtils.debounce(this._setupCollections, 500));
    }
  }, {
    key: "_setupCollections",
    value: function _setupCollections() {
      var _this3 = this;

      var featuredCollectionImages = this.el.querySelectorAll('.home-collection-image img, .home-collection-image svg');
      featuredCollectionImages.forEach(function (collectionImage) {
        var collectionImageHeight = collectionImage.getBoundingClientRect().height;
        collectionImage.style.height = 'auto';

        if (collectionImageHeight > 0) {
          _this3.collectionHeight = collectionImage.getBoundingClientRect().height;
        }
      });
      featuredCollectionImages.forEach(function (collectionImage) {
        collectionImage.style.height = '';
      });
      this.el.querySelectorAll('.home-collection-image').forEach(function (homeCollectionImageEl) {
        homeCollectionImageEl.style.height = "".concat(_this3.collectionHeight, "px");
      });
    }
  }, {
    key: "_redirectCollection",
    value: function _redirectCollection(e) {
      var currentTarget = e.currentTarget;
      if (!this.collectionsContainer.contains(currentTarget)) return;
      var url = currentTarget.dataset.url;

      if (url !== '') {
        window.location = url;
      }
    }
  }]);

  return DynamicCollectionsList;
}();


;// CONCATENATED MODULE: ./node_modules/@pixelunion/shopify-asyncview/dist/index.es.js

  /*!
   * @pixelunion/shopify-asyncview v2.0.5
   * (c) 2020 Pixel Union
  */

function index_es_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || index_es_unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function index_es_unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return index_es_arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return index_es_arrayLikeToArray(o, minLen);
}

function index_es_arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var deferred = {};

var AsyncView = /*#__PURE__*/function () {
  function AsyncView() {
    index_es_classCallCheck(this, AsyncView);
  }

  index_es_createClass(AsyncView, null, [{
    key: "load",

    /**
     * Load the template given by the provided URL into the provided
     * view
     *
     * @param {string} url - The url to load
     * @param {object} query - An object containing additional query parameters of the URL
     * @param {string} query.view - A required query parameter indicating which view to load
     * @param {object} [options] - Config options
     * @param {string} [options.hash] - A hash of the current page content
     */
    value: function load(url) {
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (!('view' in query)) {
        return Promise.reject(new Error('\'view\' not found in \'query\' parameter'));
      }

      var querylessUrl = url.replace(/\?[^#]+/, '');
      var queryParamsString = new RegExp(/.+\?([^#]+)/).exec(url);
      var queryParams = query;

      if (queryParamsString && queryParamsString.length >= 2) {
        queryParamsString[1].split('&').forEach(function (param) {
          var _param$split = param.split('='),
              _param$split2 = _slicedToArray(_param$split, 2),
              key = _param$split2[0],
              value = _param$split2[1];

          queryParams[key] = value;
        });
      } // NOTE: We're adding an additional timestamp to the query.
      // This is to prevent certain browsers from returning cached
      // versions of the url we are requesting.
      // See this PR for more info: https://github.com/pixelunion/shopify-asyncview/pull/4


      var cachebustingParams = _objectSpread2({}, queryParams, {
        _: new Date().getTime()
      });

      var hashUrl = querylessUrl.replace(/([^#]+)(.*)/, function (match, address, hash) {
        return "".concat(address, "?").concat(Object.keys(queryParams).sort().map(function (key) {
          return "".concat(key, "=").concat(encodeURIComponent(queryParams[key]));
        }).join('&')).concat(hash);
      });
      var requestUrl = querylessUrl.replace(/([^#]+)(.*)/, function (match, address, hash) {
        return "".concat(address, "?").concat(Object.keys(cachebustingParams).sort().map(function (key) {
          return "".concat(key, "=").concat(encodeURIComponent(cachebustingParams[key]));
        }).join('&')).concat(hash);
      });
      var promise = new Promise(function (resolve, reject) {
        var data;

        if (hashUrl in deferred) {
          resolve(deferred[hashUrl]);
          return;
        }

        deferred[hashUrl] = promise;

        if (options.hash) {
          data = sessionStorage.getItem(hashUrl);

          if (data) {
            var deserialized = JSON.parse(data);

            if (options.hash === deserialized.options.hash) {
              delete deferred[hashUrl];
              resolve(deserialized);
              return;
            }
          }
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', requestUrl, true);

        xhr.onload = function () {
          var el = xhr.response;
          var newOptions = {};
          var optionsEl = el.querySelector('[data-options]');

          if (optionsEl && optionsEl.innerHTML) {
            newOptions = JSON.parse(el.querySelector('[data-options]').innerHTML);
          }

          var htmlEls = el.querySelectorAll('[data-html]');
          var newHtml = {};

          if (htmlEls.length === 1 && htmlEls[0].getAttribute('data-html') === '') {
            newHtml = htmlEls[0].innerHTML;
          } else {
            for (var i = 0; i < htmlEls.length; i++) {
              newHtml[htmlEls[i].getAttribute('data-html')] = htmlEls[i].innerHTML;
            }
          }

          var dataEls = el.querySelectorAll('[data-data]');
          var newData = {};

          if (dataEls.length === 1 && dataEls[0].getAttribute('data-data') === '') {
            newData = JSON.parse(dataEls[0].innerHTML);
          } else {
            for (var _i = 0; _i < dataEls.length; _i++) {
              newData[dataEls[_i].getAttribute('data-data')] = JSON.parse(dataEls[_i].innerHTML);
            }
          }

          if (options.hash) {
            try {
              sessionStorage.setItem(hashUrl, JSON.stringify({
                options: newOptions,
                data: newData,
                html: newHtml
              }));
            } catch (error) {
              console.error(error);
            }
          }

          delete deferred[hashUrl];
          resolve({
            data: newData,
            html: newHtml
          });
        };

        xhr.onerror = function () {
          delete deferred[hashUrl];
          reject();
        };

        xhr.responseType = 'document';
        xhr.send();
      });
      return promise;
    }
  }]);

  return AsyncView;
}();

/* harmony default export */ var shopify_asyncview_dist_index_es = (AsyncView);

;// CONCATENATED MODULE: ./node_modules/morphdom/dist/morphdom-esm.js
var DOCUMENT_FRAGMENT_NODE = 11;

function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;

    // document-fragments dont have attributes so lets not do anything
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }

    // update attributes on original DOM element
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
        attr = toNodeAttrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);

            if (fromValue !== attrValue) {
                if (attr.prefix === 'xmlns'){
                    attrName = attr.name; // It's not allowed to set an attribute with the XMLNS namespace without specifying the `xmlns` prefix
                }
                fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = fromNode.getAttribute(attrName);

            if (fromValue !== attrValue) {
                fromNode.setAttribute(attrName, attrValue);
            }
        }
    }

    // Remove any extra attributes found on the original DOM element that
    // weren't found on the target element.
    var fromNodeAttrs = fromNode.attributes;

    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
        attr = fromNodeAttrs[d];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;

        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;

            if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                fromNode.removeAttributeNS(attrNamespaceURI, attrName);
            }
        } else {
            if (!toNode.hasAttribute(attrName)) {
                fromNode.removeAttribute(attrName);
            }
        }
    }
}

var range; // Create a range object for efficently rendering strings to elements.
var NS_XHTML = 'http://www.w3.org/1999/xhtml';

var doc = typeof document === 'undefined' ? undefined : document;
var HAS_TEMPLATE_SUPPORT = !!doc && 'content' in doc.createElement('template');
var HAS_RANGE_SUPPORT = !!doc && doc.createRange && 'createContextualFragment' in doc.createRange();

function createFragmentFromTemplate(str) {
    var template = doc.createElement('template');
    template.innerHTML = str;
    return template.content.childNodes[0];
}

function createFragmentFromRange(str) {
    if (!range) {
        range = doc.createRange();
        range.selectNode(doc.body);
    }

    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
}

function createFragmentFromWrap(str) {
    var fragment = doc.createElement('body');
    fragment.innerHTML = str;
    return fragment.childNodes[0];
}

/**
 * This is about the same
 * var html = new DOMParser().parseFromString(str, 'text/html');
 * return html.body.firstChild;
 *
 * @method toElement
 * @param {String} str
 */
function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      // avoid restrictions on content for things like `<tr><th>Hi</th></tr>` which
      // createContextualFragment doesn't support
      // <template> support not available in IE
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }

    return createFragmentFromWrap(str);
}

/**
 * Returns true if two node's names are the same.
 *
 * NOTE: We don't bother checking `namespaceURI` because you will never find two HTML elements with the same
 *       nodeName and different namespace URIs.
 *
 * @param {Element} a
 * @param {Element} b The target element
 * @return {boolean}
 */
function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;

    if (fromNodeName === toNodeName) {
        return true;
    }

    if (toEl.actualize &&
        fromNodeName.charCodeAt(0) < 91 && /* from tag name is upper case */
        toNodeName.charCodeAt(0) > 90 /* target tag name is lower case */) {
        // If the target element is a virtual DOM node then we may need to normalize the tag name
        // before comparing. Normal HTML elements that are in the "http://www.w3.org/1999/xhtml"
        // are converted to upper case
        return fromNodeName === toNodeName.toUpperCase();
    } else {
        return false;
    }
}

/**
 * Create an element, optionally with a known namespace URI.
 *
 * @param {string} name the element name, e.g. 'div' or 'svg'
 * @param {string} [namespaceURI] the element's namespace URI, i.e. the value of
 * its `xmlns` attribute or its inferred namespace.
 *
 * @return {Element}
 */
function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ?
        doc.createElement(name) :
        doc.createElementNS(namespaceURI, name);
}

/**
 * Copies the children of one DOM element to another DOM element
 */
function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
        var nextChild = curChild.nextSibling;
        toEl.appendChild(curChild);
        curChild = nextChild;
    }
    return toEl;
}

function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
        fromEl[name] = toEl[name];
        if (fromEl[name]) {
            fromEl.setAttribute(name, '');
        } else {
            fromEl.removeAttribute(name);
        }
    }
}

var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
        var parentNode = fromEl.parentNode;
        if (parentNode) {
            var parentName = parentNode.nodeName.toUpperCase();
            if (parentName === 'OPTGROUP') {
                parentNode = parentNode.parentNode;
                parentName = parentNode && parentNode.nodeName.toUpperCase();
            }
            if (parentName === 'SELECT' && !parentNode.hasAttribute('multiple')) {
                if (fromEl.hasAttribute('selected') && !toEl.selected) {
                    // Workaround for MS Edge bug where the 'selected' attribute can only be
                    // removed if set to a non-empty value:
                    // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12087679/
                    fromEl.setAttribute('selected', 'selected');
                    fromEl.removeAttribute('selected');
                }
                // We have to reset select element's selectedIndex to -1, otherwise setting
                // fromEl.selected using the syncBooleanAttrProp below has no effect.
                // The correct selectedIndex will be set in the SELECT special handler below.
                parentNode.selectedIndex = -1;
            }
        }
        syncBooleanAttrProp(fromEl, toEl, 'selected');
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
        syncBooleanAttrProp(fromEl, toEl, 'checked');
        syncBooleanAttrProp(fromEl, toEl, 'disabled');

        if (fromEl.value !== toEl.value) {
            fromEl.value = toEl.value;
        }

        if (!toEl.hasAttribute('value')) {
            fromEl.removeAttribute('value');
        }
    },

    TEXTAREA: function(fromEl, toEl) {
        var newValue = toEl.value;
        if (fromEl.value !== newValue) {
            fromEl.value = newValue;
        }

        var firstChild = fromEl.firstChild;
        if (firstChild) {
            // Needed for IE. Apparently IE sets the placeholder as the
            // node value and vise versa. This ignores an empty update.
            var oldValue = firstChild.nodeValue;

            if (oldValue == newValue || (!newValue && oldValue == fromEl.placeholder)) {
                return;
            }

            firstChild.nodeValue = newValue;
        }
    },
    SELECT: function(fromEl, toEl) {
        if (!toEl.hasAttribute('multiple')) {
            var selectedIndex = -1;
            var i = 0;
            // We have to loop through children of fromEl, not toEl since nodes can be moved
            // from toEl to fromEl directly when morphing.
            // At the time this special handler is invoked, all children have already been morphed
            // and appended to / removed from fromEl, so using fromEl here is safe and correct.
            var curChild = fromEl.firstChild;
            var optgroup;
            var nodeName;
            while(curChild) {
                nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
                if (nodeName === 'OPTGROUP') {
                    optgroup = curChild;
                    curChild = optgroup.firstChild;
                } else {
                    if (nodeName === 'OPTION') {
                        if (curChild.hasAttribute('selected')) {
                            selectedIndex = i;
                            break;
                        }
                        i++;
                    }
                    curChild = curChild.nextSibling;
                    if (!curChild && optgroup) {
                        curChild = optgroup.nextSibling;
                        optgroup = null;
                    }
                }
            }

            fromEl.selectedIndex = selectedIndex;
        }
    }
};

var ELEMENT_NODE = 1;
var DOCUMENT_FRAGMENT_NODE$1 = 11;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;

function noop() {}

function defaultGetNodeKey(node) {
  if (node) {
      return (node.getAttribute && node.getAttribute('id')) || node.id;
  }
}

function morphdomFactory(morphAttrs) {

    return function morphdom(fromNode, toNode, options) {
        if (!options) {
            options = {};
        }

        if (typeof toNode === 'string') {
            if (fromNode.nodeName === '#document' || fromNode.nodeName === 'HTML') {
                var toNodeHtml = toNode;
                toNode = doc.createElement('html');
                toNode.innerHTML = toNodeHtml;
            } else {
                toNode = toElement(toNode);
            }
        }

        var getNodeKey = options.getNodeKey || defaultGetNodeKey;
        var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
        var onNodeAdded = options.onNodeAdded || noop;
        var onBeforeElUpdated = options.onBeforeElUpdated || noop;
        var onElUpdated = options.onElUpdated || noop;
        var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
        var onNodeDiscarded = options.onNodeDiscarded || noop;
        var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
        var childrenOnly = options.childrenOnly === true;

        // This object is used as a lookup to quickly find all keyed elements in the original DOM tree.
        var fromNodesLookup = Object.create(null);
        var keyedRemovalList = [];

        function addKeyedRemoval(key) {
            keyedRemovalList.push(key);
        }

        function walkDiscardedChildNodes(node, skipKeyedNodes) {
            if (node.nodeType === ELEMENT_NODE) {
                var curChild = node.firstChild;
                while (curChild) {

                    var key = undefined;

                    if (skipKeyedNodes && (key = getNodeKey(curChild))) {
                        // If we are skipping keyed nodes then we add the key
                        // to a list so that it can be handled at the very end.
                        addKeyedRemoval(key);
                    } else {
                        // Only report the node as discarded if it is not keyed. We do this because
                        // at the end we loop through all keyed elements that were unmatched
                        // and then discard them in one final pass.
                        onNodeDiscarded(curChild);
                        if (curChild.firstChild) {
                            walkDiscardedChildNodes(curChild, skipKeyedNodes);
                        }
                    }

                    curChild = curChild.nextSibling;
                }
            }
        }

        /**
         * Removes a DOM node out of the original DOM
         *
         * @param  {Node} node The node to remove
         * @param  {Node} parentNode The nodes parent
         * @param  {Boolean} skipKeyedNodes If true then elements with keys will be skipped and not discarded.
         * @return {undefined}
         */
        function removeNode(node, parentNode, skipKeyedNodes) {
            if (onBeforeNodeDiscarded(node) === false) {
                return;
            }

            if (parentNode) {
                parentNode.removeChild(node);
            }

            onNodeDiscarded(node);
            walkDiscardedChildNodes(node, skipKeyedNodes);
        }

        // // TreeWalker implementation is no faster, but keeping this around in case this changes in the future
        // function indexTree(root) {
        //     var treeWalker = document.createTreeWalker(
        //         root,
        //         NodeFilter.SHOW_ELEMENT);
        //
        //     var el;
        //     while((el = treeWalker.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        // // NodeIterator implementation is no faster, but keeping this around in case this changes in the future
        //
        // function indexTree(node) {
        //     var nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT);
        //     var el;
        //     while((el = nodeIterator.nextNode())) {
        //         var key = getNodeKey(el);
        //         if (key) {
        //             fromNodesLookup[key] = el;
        //         }
        //     }
        // }

        function indexTree(node) {
            if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
                var curChild = node.firstChild;
                while (curChild) {
                    var key = getNodeKey(curChild);
                    if (key) {
                        fromNodesLookup[key] = curChild;
                    }

                    // Walk recursively
                    indexTree(curChild);

                    curChild = curChild.nextSibling;
                }
            }
        }

        indexTree(fromNode);

        function handleNodeAdded(el) {
            onNodeAdded(el);

            var curChild = el.firstChild;
            while (curChild) {
                var nextSibling = curChild.nextSibling;

                var key = getNodeKey(curChild);
                if (key) {
                    var unmatchedFromEl = fromNodesLookup[key];
                    if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
                        curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
                        morphEl(unmatchedFromEl, curChild);
                    }
                }

                handleNodeAdded(curChild);
                curChild = nextSibling;
            }
        }

        function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
            // We have processed all of the "to nodes". If curFromNodeChild is
            // non-null then we still have some from nodes left over that need
            // to be removed
            while (curFromNodeChild) {
                var fromNextSibling = curFromNodeChild.nextSibling;
                if ((curFromNodeKey = getNodeKey(curFromNodeChild))) {
                    // Since the node is keyed it might be matched up later so we defer
                    // the actual removal to later
                    addKeyedRemoval(curFromNodeKey);
                } else {
                    // NOTE: we skip nested keyed nodes from being removed since there is
                    //       still a chance they will be matched up later
                    removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                }
                curFromNodeChild = fromNextSibling;
            }
        }

        function morphEl(fromEl, toEl, childrenOnly) {
            var toElKey = getNodeKey(toEl);

            if (toElKey) {
                // If an element with an ID is being morphed then it will be in the final
                // DOM so clear it out of the saved elements collection
                delete fromNodesLookup[toElKey];
            }

            if (!childrenOnly) {
                // optional
                if (onBeforeElUpdated(fromEl, toEl) === false) {
                    return;
                }

                // update attributes on original DOM element first
                morphAttrs(fromEl, toEl);
                // optional
                onElUpdated(fromEl);

                if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
                    return;
                }
            }

            if (fromEl.nodeName !== 'TEXTAREA') {
              morphChildren(fromEl, toEl);
            } else {
              specialElHandlers.TEXTAREA(fromEl, toEl);
            }
        }

        function morphChildren(fromEl, toEl) {
            var curToNodeChild = toEl.firstChild;
            var curFromNodeChild = fromEl.firstChild;
            var curToNodeKey;
            var curFromNodeKey;

            var fromNextSibling;
            var toNextSibling;
            var matchingFromEl;

            // walk the children
            outer: while (curToNodeChild) {
                toNextSibling = curToNodeChild.nextSibling;
                curToNodeKey = getNodeKey(curToNodeChild);

                // walk the fromNode children all the way through
                while (curFromNodeChild) {
                    fromNextSibling = curFromNodeChild.nextSibling;

                    if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
                    }

                    curFromNodeKey = getNodeKey(curFromNodeChild);

                    var curFromNodeType = curFromNodeChild.nodeType;

                    // this means if the curFromNodeChild doesnt have a match with the curToNodeChild
                    var isCompatible = undefined;

                    if (curFromNodeType === curToNodeChild.nodeType) {
                        if (curFromNodeType === ELEMENT_NODE) {
                            // Both nodes being compared are Element nodes

                            if (curToNodeKey) {
                                // The target node has a key so we want to match it up with the correct element
                                // in the original DOM tree
                                if (curToNodeKey !== curFromNodeKey) {
                                    // The current element in the original DOM tree does not have a matching key so
                                    // let's check our lookup to see if there is a matching element in the original
                                    // DOM tree
                                    if ((matchingFromEl = fromNodesLookup[curToNodeKey])) {
                                        if (fromNextSibling === matchingFromEl) {
                                            // Special case for single element removals. To avoid removing the original
                                            // DOM node out of the tree (since that can break CSS transitions, etc.),
                                            // we will instead discard the current node and wait until the next
                                            // iteration to properly match up the keyed target element with its matching
                                            // element in the original tree
                                            isCompatible = false;
                                        } else {
                                            // We found a matching keyed element somewhere in the original DOM tree.
                                            // Let's move the original DOM node into the current position and morph
                                            // it.

                                            // NOTE: We use insertBefore instead of replaceChild because we want to go through
                                            // the `removeNode()` function for the node that is being discarded so that
                                            // all lifecycle hooks are correctly invoked
                                            fromEl.insertBefore(matchingFromEl, curFromNodeChild);

                                            // fromNextSibling = curFromNodeChild.nextSibling;

                                            if (curFromNodeKey) {
                                                // Since the node is keyed it might be matched up later so we defer
                                                // the actual removal to later
                                                addKeyedRemoval(curFromNodeKey);
                                            } else {
                                                // NOTE: we skip nested keyed nodes from being removed since there is
                                                //       still a chance they will be matched up later
                                                removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                                            }

                                            curFromNodeChild = matchingFromEl;
                                        }
                                    } else {
                                        // The nodes are not compatible since the "to" node has a key and there
                                        // is no matching keyed node in the source tree
                                        isCompatible = false;
                                    }
                                }
                            } else if (curFromNodeKey) {
                                // The original has a key
                                isCompatible = false;
                            }

                            isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                            if (isCompatible) {
                                // We found compatible DOM elements so transform
                                // the current "from" node to match the current
                                // target DOM node.
                                // MORPH
                                morphEl(curFromNodeChild, curToNodeChild);
                            }

                        } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                            // Both nodes being compared are Text or Comment nodes
                            isCompatible = true;
                            // Simply update nodeValue on the original node to
                            // change the text value
                            if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                                curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                            }

                        }
                    }

                    if (isCompatible) {
                        // Advance both the "to" child and the "from" child since we found a match
                        // Nothing else to do as we already recursively called morphChildren above
                        curToNodeChild = toNextSibling;
                        curFromNodeChild = fromNextSibling;
                        continue outer;
                    }

                    // No compatible match so remove the old node from the DOM and continue trying to find a
                    // match in the original DOM. However, we only do this if the from node is not keyed
                    // since it is possible that a keyed node might match up with a node somewhere else in the
                    // target tree and we don't want to discard it just yet since it still might find a
                    // home in the final DOM tree. After everything is done we will remove any keyed nodes
                    // that didn't find a home
                    if (curFromNodeKey) {
                        // Since the node is keyed it might be matched up later so we defer
                        // the actual removal to later
                        addKeyedRemoval(curFromNodeKey);
                    } else {
                        // NOTE: we skip nested keyed nodes from being removed since there is
                        //       still a chance they will be matched up later
                        removeNode(curFromNodeChild, fromEl, true /* skip keyed nodes */);
                    }

                    curFromNodeChild = fromNextSibling;
                } // END: while(curFromNodeChild) {}

                // If we got this far then we did not find a candidate match for
                // our "to node" and we exhausted all of the children "from"
                // nodes. Therefore, we will just append the current "to" node
                // to the end
                if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
                    fromEl.appendChild(matchingFromEl);
                    // MORPH
                    morphEl(matchingFromEl, curToNodeChild);
                } else {
                    var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
                    if (onBeforeNodeAddedResult !== false) {
                        if (onBeforeNodeAddedResult) {
                            curToNodeChild = onBeforeNodeAddedResult;
                        }

                        if (curToNodeChild.actualize) {
                            curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                        }
                        fromEl.appendChild(curToNodeChild);
                        handleNodeAdded(curToNodeChild);
                    }
                }

                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
            }

            cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);

            var specialElHandler = specialElHandlers[fromEl.nodeName];
            if (specialElHandler) {
                specialElHandler(fromEl, toEl);
            }
        } // END: morphChildren(...)

        var morphedNode = fromNode;
        var morphedNodeType = morphedNode.nodeType;
        var toNodeType = toNode.nodeType;

        if (!childrenOnly) {
            // Handle the case where we are given two DOM nodes that are not
            // compatible (e.g. <div> --> <span> or <div> --> TEXT)
            if (morphedNodeType === ELEMENT_NODE) {
                if (toNodeType === ELEMENT_NODE) {
                    if (!compareNodeNames(fromNode, toNode)) {
                        onNodeDiscarded(fromNode);
                        morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
                    }
                } else {
                    // Going from an element node to a text node
                    morphedNode = toNode;
                }
            } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) { // Text or comment node
                if (toNodeType === morphedNodeType) {
                    if (morphedNode.nodeValue !== toNode.nodeValue) {
                        morphedNode.nodeValue = toNode.nodeValue;
                    }

                    return morphedNode;
                } else {
                    // Text node to something else
                    morphedNode = toNode;
                }
            }
        }

        if (morphedNode === toNode) {
            // The "to node" was not compatible with the "from node" so we had to
            // toss out the "from node" and use the "to node"
            onNodeDiscarded(fromNode);
        } else {
            if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
                return;
            }

            morphEl(morphedNode, toNode, childrenOnly);

            // We now need to loop over any keyed nodes that might need to be
            // removed. We only do the removal if we know that the keyed node
            // never found a match. When a keyed node is matched up we remove
            // it out of fromNodesLookup and we use fromNodesLookup to determine
            // if a keyed node has been matched up or not
            if (keyedRemovalList) {
                for (var i=0, len=keyedRemovalList.length; i<len; i++) {
                    var elToRemove = fromNodesLookup[keyedRemovalList[i]];
                    if (elToRemove) {
                        removeNode(elToRemove, elToRemove.parentNode, false);
                    }
                }
            }
        }

        if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
            if (morphedNode.actualize) {
                morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
            }
            // If we had to swap out the from node with a new node because the old
            // node was not compatible with the target node then we need to
            // replace the old DOM node in the original DOM tree. This is only
            // possible if the original DOM node was part of a DOM tree which
            // we know is the case if it has a parent node.
            fromNode.parentNode.replaceChild(morphedNode, fromNode);
        }

        return morphedNode;
    };
}

var morphdom = morphdomFactory(morphAttrs);

/* harmony default export */ var morphdom_esm = (morphdom);

;// CONCATENATED MODULE: ./node_modules/@pixelunion/shopify-surface-pick-up/dist/index.es.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function dist_index_es_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function dist_index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function dist_index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) dist_index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) dist_index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}

function index_es_defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function index_es_ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function index_es_objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      index_es_ownKeys(Object(source), true).forEach(function (key) {
        index_es_defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      index_es_ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var LOCAL_STORAGE_KEY = 'pxu-shopify-surface-pick-up';
var loadingClass = 'surface-pick-up--loading';

var isNotExpired = function isNotExpired(timestamp) {
  return timestamp + 1000 * 60 * 60 >= Date.now();
};

var removeTrailingSlash = function removeTrailingSlash(s) {
  return s.replace(/(.*)\/$/, '$1');
}; // Haversine Distance
// The haversine formula is an equation giving great-circle distances between
// two points on a sphere from their longitudes and latitudes


function calculateDistance(latitude1, longitude1, latitude2, longitude2, unitSystem) {
  var dtor = Math.PI / 180;
  var radius = unitSystem === 'metric' ? 6378.14 : 3959;
  var rlat1 = latitude1 * dtor;
  var rlong1 = longitude1 * dtor;
  var rlat2 = latitude2 * dtor;
  var rlong2 = longitude2 * dtor;
  var dlon = rlong1 - rlong2;
  var dlat = rlat1 - rlat2;
  var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.pow(Math.sin(dlon / 2), 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c;
}

function getGeoLocation() {
  return _getGeoLocation.apply(this, arguments);
}

function _getGeoLocation() {
  _getGeoLocation = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              var options = {
                maximumAge: 3600000,
                // 1 hour
                timeout: 5000
              };

              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (_ref3) {
                  var coords = _ref3.coords;
                  return resolve(coords);
                }, reject, options);
              } else {
                reject();
              }
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getGeoLocation.apply(this, arguments);
}

function setLocation(_x) {
  return _setLocation.apply(this, arguments);
}

function _setLocation() {
  _setLocation = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref) {
    var latitude, longitude, newData;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            latitude = _ref.latitude, longitude = _ref.longitude;
            newData = {
              latitude: latitude,
              longitude: longitude,
              timestamp: Date.now()
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
            return _context2.abrupt("return", fetch('/localization.json', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                latitude: latitude,
                longitude: longitude
              })
            }).then(function () {
              return {
                latitude: latitude,
                longitude: longitude
              };
            }));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _setLocation.apply(this, arguments);
}

function getLocation() {
  return _getLocation.apply(this, arguments);
}

function _getLocation() {
  _getLocation = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var requestLocation,
        cachedLocation,
        _args3 = arguments;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            requestLocation = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : false;
            cachedLocation = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

            if (!(cachedLocation && isNotExpired(cachedLocation.timestamp))) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt("return", cachedLocation);

          case 4:
            if (!requestLocation) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", getGeoLocation().then(function (coords) {
              setLocation(coords); // We don't need to wait for this

              return coords;
            }));

          case 6:
            return _context3.abrupt("return", null);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getLocation.apply(this, arguments);
}

var SurfacePickUp = /*#__PURE__*/function () {
  function SurfacePickUp(el, options) {
    dist_index_es_classCallCheck(this, SurfacePickUp);

    this.el = el;
    this.options = index_es_objectSpread2({
      root_url: window.Theme && window.Theme.routes && window.Theme.routes.root_url || ''
    }, options);
    this.options.root_url = removeTrailingSlash(this.options.root_url);
    this.callbacks = [];
    this.onBtnPress = null;
    this.latestVariantId = null;
  }

  dist_index_es_createClass(SurfacePickUp, [{
    key: "load",
    value: function load(variantId) {
      var _this = this;

      // If no variant is available, empty element and quick-return
      if (!variantId) {
        this.el.innerHTML = '';
        return Promise.resolve(true);
      } // Because Shopify doesn't expose any `pick_up_enabled` data on the shop object, we
      // don't know if the variant might be, or is definitely not available for pick up.
      // Until we know the shop has > 0 pick up locations, we want to avoid prompting the
      // user for location data (it's annoying, and only makes sense to do if we use it).
      //
      // Instead, we have to make an initial request, check and see if any pick up locations
      // were returned, then ask for the users location, then make another request to get the
      // location-aware pick up locations.
      //
      // As far as I can tell the pick up aware locations differ only in sort order - which
      // we could do on the front end - but we're following this approach to ensure future
      // compatibility with any changes Shopify makes (maybe disabling options based on
      // user location, or whatever else).
      //
      // Shopify has indicated they will look into adding pick_up_enabled data to the shop
      // object, which which case this method can be greatly simplifed into 2 simple cases.


      this.latestVariantId = variantId;
      this.el.classList.add(loadingClass);
      return this._getData(variantId).then(function (data) {
        return _this._injectData(data);
      });
    }
  }, {
    key: "onModalRequest",
    value: function onModalRequest(callback) {
      if (this.callbacks.indexOf(callback) >= 0) return;
      this.callbacks.push(callback);
    }
  }, {
    key: "offModalRequest",
    value: function offModalRequest(callback) {
      this.callbacks.splice(this.callbacks.indexOf(callback));
    }
  }, {
    key: "unload",
    value: function unload() {
      this.callbacks = [];
      this.el.innerHTML = '';
    }
  }, {
    key: "_getData",
    value: function _getData(variantId) {
      var _this2 = this;

      return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        var requestUrl = "".concat(_this2.options.root_url, "/variants/").concat(variantId, "/?section_id=surface-pick-up");
        xhr.open('GET', requestUrl, true);

        xhr.onload = function () {
          var el = xhr.response;
          var embed = el.querySelector('[data-html="surface-pick-up-embed"]');
          var itemsContainer = el.querySelector('[data-html="surface-pick-up-items"]');
          var items = itemsContainer.content.querySelectorAll('[data-surface-pick-up-item]');
          resolve({
            embed: embed,
            itemsContainer: itemsContainer,
            items: items,
            variantId: variantId
          });
        };

        xhr.onerror = function () {
          resolve({
            embed: {
              innerHTML: ''
            },
            itemsContainer: {
              innerHTML: ''
            },
            items: [],
            variantId: variantId
          });
        };

        xhr.responseType = 'document';
        xhr.send();
      });
    }
  }, {
    key: "_injectData",
    value: function _injectData(_ref2) {
      var _this3 = this;

      var embed = _ref2.embed,
          itemsContainer = _ref2.itemsContainer,
          items = _ref2.items,
          variantId = _ref2.variantId;

      if (variantId !== this.latestVariantId || items.length === 0) {
        this.el.innerHTML = '';
        this.el.classList.remove(loadingClass);
        return;
      }

      this.el.innerHTML = embed.innerHTML;
      this.el.classList.remove(loadingClass);
      var calculatedDistances = false;

      var calculateDistances = function calculateDistances() {
        if (calculatedDistances) return Promise.resolve();
        return getLocation(true).then(function (coords) {
          items.forEach(function (item) {
            var distanceEl = item.querySelector('[data-distance]');
            var distanceUnitEl = item.querySelector('[data-distance-unit]');
            var unitSystem = distanceUnitEl.dataset.distanceUnit;
            var itemLatitude = parseFloat(distanceEl.dataset.latitude);
            var itemLongitude = parseFloat(distanceEl.dataset.longitude);

            if (coords && isFinite(itemLatitude) && isFinite(itemLongitude)) {
              var distance = calculateDistance(coords.latitude, coords.longitude, itemLatitude, itemLongitude, unitSystem);
              distanceEl.innerHTML = distance.toFixed(1);
            } else {
              distanceEl.remove();
              distanceUnitEl.remove();
            }
          });
        })["catch"](function (e) {
          console.log(e);
          items.forEach(function (item) {
            var distanceEl = item.querySelector('[data-distance]');
            var distanceUnitEl = item.querySelector('[data-distance-unit]');
            distanceEl.remove();
            distanceUnitEl.remove();
          });
        })["finally"](function () {
          calculatedDistances = true;
        });
      };

      this.el.querySelector('[data-surface-pick-up-embed-modal-btn]').addEventListener('click', function () {
        calculateDistances().then(function () {
          return _this3.callbacks.forEach(function (callback) {
            return callback(itemsContainer.innerHTML);
          });
        });
      });
    }
  }]);

  return SurfacePickUp;
}();

/* harmony default export */ var shopify_surface_pick_up_dist_index_es = (SurfacePickUp);

;// CONCATENATED MODULE: ./source/scripts/helpers/VariantHelper.js
function VariantHelper_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function VariantHelper_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function VariantHelper_createClass(Constructor, protoProps, staticProps) { if (protoProps) VariantHelper_defineProperties(Constructor.prototype, protoProps); if (staticProps) VariantHelper_defineProperties(Constructor, staticProps); return Constructor; }

function filter(nodelist, fn) {
  var filtered = [];

  for (var i = 0; i < nodelist.length; i++) {
    var node = nodelist[i];

    if (fn(node)) {
      filtered.push(node);
    }
  }

  return filtered;
}

var VariantHelper = /*#__PURE__*/function () {
  function VariantHelper(_ref) {
    var _ref$addToCartButton = _ref.addToCartButton,
        addToCartButton = _ref$addToCartButton === void 0 ? null : _ref$addToCartButton,
        _ref$priceFields = _ref.priceFields,
        priceFields = _ref$priceFields === void 0 ? null : _ref$priceFields,
        _ref$productForm = _ref.productForm,
        productForm = _ref$productForm === void 0 ? null : _ref$productForm,
        _ref$productGallery = _ref.productGallery,
        productGallery = _ref$productGallery === void 0 ? null : _ref$productGallery,
        _ref$selector = _ref.selector,
        selector = _ref$selector === void 0 ? null : _ref$selector,
        _ref$type = _ref.type,
        type = _ref$type === void 0 ? 'select' : _ref$type,
        _ref$productJSON = _ref.productJSON,
        productJSON = _ref$productJSON === void 0 ? null : _ref$productJSON,
        _ref$productSettings = _ref.productSettings,
        productSettings = _ref$productSettings === void 0 ? null : _ref$productSettings,
        _ref$unitPrice = _ref.unitPrice,
        unitPrice = _ref$unitPrice === void 0 ? null : _ref$unitPrice,
        _ref$taxLine = _ref.taxLine,
        taxLine = _ref$taxLine === void 0 ? null : _ref$taxLine;

    VariantHelper_classCallCheck(this, VariantHelper);

    this.callbacks = [];
    this.options = {
      addToCartButton: addToCartButton,
      priceFields: priceFields,
      productForm: productForm,
      productGallery: productGallery,
      selector: selector,
      type: type,
      productJSON: productJSON,
      productSettings: productSettings,
      unitPrice: unitPrice,
      taxLine: taxLine
    };
    this.enableHistory = false;
    this.masterSelect = this.options.productForm.querySelector('.product-select'); // Disabled history state updating in the TE

    var isShopify = window.Shopify && window.Shopify.preview_host;

    if (window.history && window.history.replaceState && this.options.productSettings.enableHistory && !isShopify) {
      this.enableHistory = true;
    }

    this._init();

    this._bindEvents();
  }

  VariantHelper_createClass(VariantHelper, [{
    key: "onVariantChange",
    value: function onVariantChange(callback) {
      if (this.callbacks.indexOf(callback) >= 0) {
        return;
      }

      this.callbacks.push(callback);
    }
  }, {
    key: "offVariantChange",
    value: function offVariantChange(callback) {
      if (this.callbacks.indexOf(callback) === -1) {
        return;
      }

      this.callbacks.splice(this.callbacks.indexOf(callback));
    }
  }, {
    key: "_init",
    value: function _init() {
      var _this = this;

      if (this.options.type === 'select') {
        this.options.selector.forEach(function (selector) {
          return _this._setSelectLabel(selector);
        });
      }
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this2 = this;

      this.options.selector.forEach(function (selector) {
        return selector.addEventListener('change', function (event) {
          return _this2._variantChange(event);
        });
      });
    }
  }, {
    key: "unload",
    value: function unload() {
      var _this3 = this;

      this.options.selector.forEach(function (selector) {
        return selector.removeEventListener('change', function (event) {
          return _this3._variantChange(event);
        });
      });
    }
  }, {
    key: "_setSelectLabel",
    value: function _setSelectLabel(select) {
      if (!select) return;
      var value = select.value,
          previousSibling = select.previousSibling;
      previousSibling.innerText = value;
    }
  }, {
    key: "getCurrentOptions",
    value: function getCurrentOptions() {
      var productOptions = [];
      var inputs = this.options.selector;

      if (this.options.type === 'radio') {
        inputs = filter(inputs, function (input) {
          return input.checked;
        });
      }

      inputs.forEach(function (input) {
        return productOptions.push(input.value);
      });
      return productOptions;
    }
  }, {
    key: "getVariantFromOptions",
    value: function getVariantFromOptions(productOptions) {
      var _this4 = this;

      if (this.options.productJSON.variants == null) {
        return;
      }

      var foundVariant = null;

      var _loop = function _loop(i) {
        var variant = _this4.options.productJSON.variants[i];
        var isMatch = productOptions.every(function (value, index) {
          return variant.options[index] === value;
        });

        if (isMatch) {
          foundVariant = variant;
        }
      };

      for (var i = 0; i < this.options.productJSON.variants.length; i++) {
        _loop(i);
      }

      return foundVariant;
    }
  }, {
    key: "_updateMasterSelect",
    value: function _updateMasterSelect(variant) {
      if (variant == null) {
        return;
      }

      var event = document.createEvent('Event');
      event.initEvent('change', true, true);
      this.masterSelect.value = variant.id;
      this.masterSelect.dispatchEvent(event);
    }
  }, {
    key: "_updatePrice",
    value: function _updatePrice(variant) {
      var _this$options = this.options,
          addToCartButton = _this$options.addToCartButton,
          priceFields = _this$options.priceFields,
          productSettings = _this$options.productSettings,
          unitPrice = _this$options.unitPrice,
          taxLine = _this$options.taxLine,
          productDetails = _this$options.productDetails;
      var unitPriceAmount = unitPrice.querySelector('[data-unit-price-amount]');
      var unitPriceMeasure = unitPrice.querySelector('[data-unit-price-measure]');
      var unitPriceQuantity = unitPrice.querySelector('[data-unit-price-quantity]');

      if (variant) {
        // strip all of the old data attributes
        priceFields.forEach(function (priceField) {
          var moneyEls = priceField.querySelectorAll('.money');
          moneyEls.forEach(function (moneyEl) {
            for (var j = 0; j < moneyEl.attributes.length; j++) {
              var attribute = moneyEl.attributes[j];

              if (attribute.name.indexOf('data-') > -1) {
                moneyEl.removeAttribute(attribute.name);
              }
            }
          });
        });

        if (taxLine) {
          if (variant.taxable) {
            taxLine.classList.remove('hidden');
          } else {
            taxLine.classList.add('hidden');
          }
        }

        if (variant.available) {
          addToCartButton.value = productSettings.addToCartText;
          addToCartButton.classList.remove('disabled');
          addToCartButton.removeAttribute('disabled');
        } else {
          addToCartButton.value = productSettings.soldOutText;
          addToCartButton.classList.add('disabled');
          addToCartButton.setAttribute('disabled', '');
        }

        if (variant.compare_at_price > variant.price) {
          priceFields.forEach(function (priceField) {
            var moneyEls = priceField.querySelectorAll('.money:not(.original)');
            moneyEls.forEach(function (moneyEl) {
              moneyEl.innerHTML = window.Theme.Currency.formatMoney(variant.price, window.Theme.moneyFormat);
            });
          });
          priceFields.forEach(function (priceField) {
            var moneyEls = priceField.querySelectorAll('.money.original');
            moneyEls.forEach(function (moneyEl) {
              moneyEl.innerHTML = window.Theme.Currency.formatMoney(variant.compare_at_price, window.Theme.moneyFormat);
              moneyEl.classList.add('visible');
            });
          });
        } else {
          priceFields.forEach(function (priceField) {
            var moneyEls = priceField.querySelectorAll('.money');
            moneyEls.forEach(function (moneyEl) {
              moneyEl.innerHTML = window.Theme.Currency.formatMoney(variant.price, window.Theme.moneyFormat);
            });
          });
          priceFields.forEach(function (priceField) {
            var moneyEls = priceField.querySelectorAll('.money.original');
            moneyEls.forEach(function (moneyEl) {
              moneyEl.classList.remove('visible');
            });
          });
        }

        if (variant.unit_price) {
          unitPrice.classList.remove('hidden');

          if (unitPriceQuantity) {
            unitPriceQuantity.innerHTML = "".concat(variant.unit_price_measurement.quantity_value).concat(variant.unit_price_measurement.quantity_unit);
          }

          if (unitPriceAmount) {
            unitPriceAmount.innerHTML = window.Theme.Currency.formatMoney(variant.unit_price, Theme.moneyFormat);
          }

          if (unitPriceMeasure) {
            if (variant.unit_price_measurement.reference_value !== 1) {
              unitPriceMeasure.innerHTML = "".concat(variant.unit_price_measurement.reference_value).concat(variant.unit_price_measurement.reference_unit);
            } else {
              unitPriceMeasure.innerHTML = variant.unit_price_measurement.reference_unit;
            }
          }
        } else {
          unitPrice.classList.add('hidden');
        }
      } else {
        // Variant doesn't exist
        addToCartButton.value = productSettings.unavailableText;
        addToCartButton.classList.add('disabled');
        addToCartButton.setAttribute('disabled', '');
      }
    }
  }, {
    key: "_updateImages",
    value: function _updateImages(variant) {
      var imageId = __guard__(variant != null ? variant.featured_image : undefined, function (x) {
        return x.id;
      });

      var imagePosition = __guard__(variant != null ? variant.featured_image : undefined, function (x1) {
        return x1.position;
      }) - 1;
      this.options.productGallery.selectMediaByVariant(variant);
    }
  }, {
    key: "_updateHistory",
    value: function _updateHistory(variant) {
      if (!this.enableHistory || variant == null) {
        return;
      }

      var re = new RegExp('([?|&]variant=)[0-9]+(&{0,1})');
      var search = window.location.search;

      if (search.match(re)) {
        search = search.replace(re, "$1".concat(variant.id, "$2"));
      } else if (search.indexOf('?') !== -1) {
        search += "&variant=".concat(variant.id);
      } else {
        search += "?variant=".concat(variant.id);
      }

      var newUrl = [window.location.protocol, '//', window.location.host, window.location.pathname, search];
      var variantUrl = newUrl.join('');
      window.history.replaceState({
        path: variantUrl
      }, '', variantUrl);
    }
  }, {
    key: "_variantChange",
    value: function _variantChange(event) {
      if (this.options.type === 'select') {
        this._setSelectLabel(event.currentTarget);
      }

      var productOptions = this.getCurrentOptions();
      var variant = this.getVariantFromOptions(productOptions);

      this._updateMasterSelect(variant);

      this._updatePrice(variant);

      this._updateImages(variant);

      this._updateHistory(variant);

      this.callbacks.forEach(function (callback) {
        return callback(variant);
      });
    }
  }]);

  return VariantHelper;
}();



function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
// EXTERNAL MODULE: ./node_modules/@pixelunion/events/dist/EventHandler.js
var EventHandler = __webpack_require__(766);
;// CONCATENATED MODULE: ./source/scripts/components/ImageZoom.js
function ImageZoom_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ImageZoom_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ImageZoom_createClass(Constructor, protoProps, staticProps) { if (protoProps) ImageZoom_defineProperties(Constructor.prototype, protoProps); if (staticProps) ImageZoom_defineProperties(Constructor, staticProps); return Constructor; }

var ImageZoom = /*#__PURE__*/function () {
  function ImageZoom(component) {
    ImageZoom_classCallCheck(this, ImageZoom);

    this.viewport = component.viewport;
    this.images = component.images;
    this.imageId = null;
    this.el = null;
    this.zoomArea = null;
    this.zoomAreaContainer = null;
    this.toggleZoomEvent = this.toggleZoom.bind(this);
    this.zoomImageEvent = this.zoomImage.bind(this);
  }

  ImageZoom_createClass(ImageZoom, [{
    key: "_unbindEvents",
    value: function _unbindEvents() {
      if (this.zoomAreaContainer) {
        this.zoomAreaContainer.removeEventListener('click', this.toggleZoomEvent);
      }

      if (this.zoomArea) {
        this.zoomArea.removeEventListener('mouseout', this.toggleZoomEvent);
        this.zoomArea.removeEventListener('mousemove', this.zoomImageEvent);
      }
    }
  }, {
    key: "setVariables",
    value: function setVariables() {
      var currentImage = this.viewport.querySelector('[data-product-gallery-selected="true"] img');

      if (!currentImage) {
        this.imageId = null;
        this.el = null;
        this.zoomArea = null;
        this.zoomAreaContainer = null;
        return;
      }

      this.imageId = currentImage.getAttribute('data-image-zoom');
      var div = document.createElement('div');
      div.innerHTML = this.images[this.imageId];
      this.el = div.firstElementChild;
      this.zoomArea = this.viewport.querySelector("[data-product-zoom-id=\"".concat(this.imageId, "\"]"));
      this.zoomAreaContainer = this.viewport.querySelector("[data-media=\"".concat(this.imageId, "\"] .product-gallery--media-wrapper"));
      this.zoomAreaContainer.addEventListener('click', this.toggleZoomEvent);
      this.zoomArea.addEventListener('mouseout', this.toggleZoomEvent);
      this.zoomArea.addEventListener('mousemove', this.zoomImageEvent);
    }
  }, {
    key: "prepareZoom",
    value: function prepareZoom(resetVariables) {
      var _this = this;

      if (resetVariables) {
        this._unbindEvents();

        this.setVariables();
      }

      if (!this.imageId) return;
      var imageSource = this.el.getAttribute('src');

      var _this$zoomAreaContain = this.zoomAreaContainer.getBoundingClientRect(),
          photoAreaWidth = _this$zoomAreaContain.width,
          photoAreaHeight = _this$zoomAreaContain.height;

      var newImage = new Image();
      newImage.addEventListener('load', function () {
        _this.zoomImageWidth = newImage.width;
        _this.zoomImageHeight = newImage.height;
        var ratio = Math.max(_this.zoomImageWidth / photoAreaWidth, _this.zoomImageHeight / photoAreaHeight); // Only enable the zoom if a certain zooming ratio is met.

        if (ratio < 1.4) {
          _this.zoomAreaContainer.classList.remove('zoom-enabled');
        } else {
          _this.zoomAreaContainer.classList.add('zoom-enabled');

          _this.zoomArea.style.backgroundImage = "url(".concat(imageSource, ")");
        }
      });
      newImage.src = imageSource;
    }
  }, {
    key: "toggleZoom",
    value: function toggleZoom(e) {
      if (this.zoomAreaContainer.classList.contains('zoom-enabled')) {
        if (e.type === 'mouseout') {
          this.zoomArea.classList.remove('active');
          return;
        }

        this.zoomArea.classList.toggle('active');
        this.zoomImage(e);
      }
    }
  }, {
    key: "zoomImage",
    value: function zoomImage(e) {
      var _this$zoomArea$getBou = this.zoomArea.getBoundingClientRect(),
          zoomWidth = _this$zoomArea$getBou.width,
          zoomHeight = _this$zoomArea$getBou.height;

      var _this$zoomAreaContain2 = this.zoomAreaContainer.getBoundingClientRect(),
          bigImageTop = _this$zoomAreaContain2.top,
          bigImageLeft = _this$zoomAreaContain2.left;

      var bigImageX = Math.round(bigImageLeft);
      var bigImageY = Math.round(bigImageTop);
      var mousePositionX = e.pageX - bigImageX;
      var mousePositionY = e.pageY - bigImageY; // Make sure our mouse position is still inside our box.

      if (mousePositionX < zoomWidth && mousePositionY < zoomHeight && mousePositionX > 0 && mousePositionY > 0) {
        if (this.zoomArea.classList.contains('active')) {
          // Figure out how to position the zoomed image.
          var ratioX = Math.round(mousePositionX / zoomWidth * this.zoomImageWidth - zoomWidth / 2) * -1;
          var ratioY = Math.round(mousePositionY / zoomHeight * this.zoomImageHeight - zoomHeight / 2) * -1;

          if (ratioX > 0) {
            ratioX = 0;
          }

          if (ratioY > 0) {
            ratioY = 0;
          }

          if (ratioX < -(this.zoomImageWidth - zoomWidth)) {
            ratioX = -(this.zoomImageWidth - zoomWidth);
          }

          if (ratioY < -(this.zoomImageHeight - zoomHeight)) {
            ratioY = -(this.zoomImageHeight - zoomHeight);
          }

          var newBackgroundPosition = "".concat(ratioX, "px ").concat(ratioY, "px");
          this.zoomArea.style.backgroundPosition = newBackgroundPosition;
        }
      }
    }
  }]);

  return ImageZoom;
}();


;// CONCATENATED MODULE: ./source/scripts/helpers/youtubeIframeAPIHelper.js
var apiReadyResolve = null;
var apiReady = null;
function youtubeIframeAPIHelper_load() {
  if (apiReady) return apiReady;
  apiReady = new Promise(function (resolve) {
    apiReadyResolve = resolve;
  });

  if (window.onYouTubeIframeAPIReady) {
    // If onYouTubeIframeAPIReady is already defined, we need to call it
    var _window = window,
        onYouTubeIframeAPIReady = _window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = function () {
      onYouTubeIframeAPIReady();
      apiReadyResolve();
    };
  } else {
    window.onYouTubeIframeAPIReady = apiReadyResolve;
  }

  if (!document.querySelector('#youtube-api-script')) {
    var script = document.createElement('script');
    script.setAttribute('id', 'youtube-api-script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', 'https://www.youtube.com/iframe_api');
    document.body.appendChild(script);
  }

  if (window.YT && YT.loaded) {
    apiReadyResolve();
  }

  return apiReady;
}
;// CONCATENATED MODULE: ./source/scripts/components/ProductSlideshow.js
function ProductSlideshow_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProductSlideshow_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProductSlideshow_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductSlideshow_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductSlideshow_defineProperties(Constructor, staticProps); return Constructor; }



var ProductSlideshow = /*#__PURE__*/function () {
  function ProductSlideshow(_ref) {
    var _this = this;

    var el = _ref.el;

    ProductSlideshow_classCallCheck(this, ProductSlideshow);

    this.el = el;
    this.productGalleryNavigationPrevious = this.el.querySelector('.product-thumbnails-navigation-previous');
    this.productGalleryNavigationNext = this.el.querySelector('.product-thumbnails-navigation-next');
    this.productGalleryNavigationWrapper = this.el.querySelector('.product-gallery--navigation-wrapper');
    this.productGalleryNavigation = this.el.querySelector('.product-gallery--navigation');
    this.productGalleryMediaThumbnails = this.el.querySelectorAll('.product-gallery--media-thumbnail');

    if (this.productGalleryNavigationPrevious) {
      this.productGalleryNavigationPrevious.addEventListener('click', function (event) {
        return _this.moveProductThumbnails(event);
      });
    }

    if (this.productGalleryNavigationNext) {
      this.productGalleryNavigationNext.addEventListener('click', function (event) {
        return _this.moveProductThumbnails(event);
      });
    }

    this.moving = false;

    if (this.productGalleryNavigation) {
      dist_index_es.watch(this.productGalleryNavigation);

      if (this.productGalleryNavigation.classList.contains('has-side-scroll')) {
        this.setupProductSlideshow();
        this.productGalleryNavigation.addEventListener('rimg:load', function () {
          _this.setupProductSlideshow();
        });
        window.addEventListener('resize', function () {
          var selectedThumbnail = _this.el.querySelector('[data-product-gallery-selected="true"]');

          _this.setupProductSlideshow(true);

          if (selectedThumbnail) {
            _this.selectThumbnail(selectedThumbnail.dataset.media);
          } else {
            _this.productGalleryNavigation.style.left = 0;
          }
        });
      }
    }
  }

  ProductSlideshow_createClass(ProductSlideshow, [{
    key: "setupProductSlideshow",
    value: function setupProductSlideshow() {
      var _this2 = this;

      var tallestImageHeight = 0;
      var containerWidth = 0;
      this.productThumbnailPadding = parseInt(window.getComputedStyle(this.productGalleryMediaThumbnails[0]).paddingLeft, 10) * 2;
      this.productThumbnailMargin = parseInt(window.getComputedStyle(this.productGalleryMediaThumbnails[0]).marginRight, 10) * 2;
      this.productGalleryMediaThumbnails.forEach(function (productGalleryMediaThumbnail) {
        productGalleryMediaThumbnail.style.width = "".concat(_this2.productGalleryNavigationWrapper.getBoundingClientRect().width / 4 - _this2.productThumbnailPadding - _this2.productThumbnailMargin, "px");
        var currentImageHeight = productGalleryMediaThumbnail.getBoundingClientRect().height;

        var currentImageWidth = productGalleryMediaThumbnail.getBoundingClientRect().width + _this2.productThumbnailMargin;

        if (currentImageHeight > tallestImageHeight) {
          tallestImageHeight = currentImageHeight;
        }

        currentImageWidth += _this2.productThumbnailMargin;
        containerWidth += currentImageWidth;
      });
      this.productGalleryNavigationWrapper.style.height = "".concat(tallestImageHeight, "px");
      this.productGalleryNavigation.style.width = "".concat(containerWidth, "px");
    }
  }, {
    key: "moveProductThumbnails",
    value: function moveProductThumbnails(e) {
      var _this$productGalleryN = this.productGalleryNavigationWrapper.getBoundingClientRect(),
          containerWidth = _this$productGalleryN.width;

      var currentPosition = this.productGalleryNavigation.offsetLeft; // To prevent moving the slider too far to one side or another by clicking next/previous when it's between slides
      // we need to check that the current position is a multiple of the slide width (ie. we only ever want it to move a full slide)
      // Rounding the values makes them easier to compare, but creates a small margin of error of 1px, so we should check the position
      // against the rounded container width ± 1

      var absCurrentPosition = Math.round(Math.abs(currentPosition));
      var roundedContainerWidth = Math.round(containerWidth);
      var positionRemainder = absCurrentPosition % roundedContainerWidth;
      var positionRemainderMax = roundedContainerWidth + 1;
      var positionRemainderMin = roundedContainerWidth - 1;
      if (positionRemainder !== 0 && positionRemainder !== positionRemainderMax && positionRemainder !== positionRemainderMin) return;

      if (e.currentTarget.classList.contains('product-thumbnails-navigation-next') && currentPosition - containerWidth > -this.productGalleryNavigation.getBoundingClientRect().width) {
        this.productGalleryNavigation.style.left = "".concat(currentPosition - containerWidth, "px");
      } else if (e.target.classList.contains('product-thumbnails-navigation-previous') && currentPosition < 0) {
        this.productGalleryNavigation.style.left = "".concat(currentPosition + containerWidth, "px");
      }
    }
  }, {
    key: "selectThumbnail",
    value: function selectThumbnail(mediaId) {
      if (!this.productGalleryNavigation) return;
      var thumbnail = this.productGalleryNavigation.querySelector("[data-media=\"".concat(mediaId, "\"]"));
      var thumbnailIndex = thumbnail.dataset.productGalleryThumbnail;
      var slides = Math.floor(thumbnailIndex / 4);
      var containerWidth = this.productGalleryNavigationWrapper.getBoundingClientRect().width;
      var newPosition = -(containerWidth * slides);
      this.productGalleryNavigation.style.left = "".concat(newPosition, "px");
    }
  }]);

  return ProductSlideshow;
}();


// EXTERNAL MODULE: ./node_modules/masonry-layout/masonry.js
var masonry = __webpack_require__(751);
var masonry_default = /*#__PURE__*/__webpack_require__.n(masonry);
;// CONCATENATED MODULE: ./source/scripts/components/MasonryGrid.js
function MasonryGrid_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function MasonryGrid_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function MasonryGrid_createClass(Constructor, protoProps, staticProps) { if (protoProps) MasonryGrid_defineProperties(Constructor.prototype, protoProps); if (staticProps) MasonryGrid_defineProperties(Constructor, staticProps); return Constructor; }





var MasonryGrid = /*#__PURE__*/function () {
  function MasonryGrid(_ref) {
    var el = _ref.el,
        settings = _ref.settings;

    MasonryGrid_classCallCheck(this, MasonryGrid);

    this.el = el;
    this.layout = this.layout.bind(this);
    dist_index_es.watch(this.el);
    var defaultSettings = {
      itemSelector: '[data-masonry-item]',
      columnWidth: '[data-masonry-sizer]',
      gutter: 0,
      percentPosition: false
    };
    this.settings = scripts_themeUtils.extend(defaultSettings, settings);
    this.masonry = new (masonry_default())(this.el, this.settings);
    this.layout();
    this.el.addEventListener('rimg:load', this.layout);
  }

  MasonryGrid_createClass(MasonryGrid, [{
    key: "layout",
    value: function layout() {
      this.masonry.layout();
    }
  }, {
    key: "unload",
    value: function unload() {
      this.masonry.destroy();
      this.el.removeEventListener('rimg:load', this.layout);
    }
  }]);

  return MasonryGrid;
}();


;// CONCATENATED MODULE: ./source/scripts/components/ProductGallery.js
function ProductGallery_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProductGallery_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProductGallery_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductGallery_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductGallery_defineProperties(Constructor, staticProps); return Constructor; }










var ProductGallery = /*#__PURE__*/function () {
  function ProductGallery(el, settings) {
    ProductGallery_classCallCheck(this, ProductGallery);

    this.el = el;
    this.initialGallery = this.el.innerHTML;
    this.settings = settings;
    this.layout = this.el.dataset.productGalleryLayout;
    this.productContainer = this.settings.product_container;
    this.media = [];
    this.models = {};
    this.players = [];
    this.flickityEvents = [];
    this.pageDots = null;
    this.flickityNavButtons = null;
    this.externalVideoLoaded = false;
    this.videoLoaded = false;
    this.modelLoaded = false;
    this.productMasonryLayout = null;
    this.flickity = null;
    this.viewport = this.el.querySelector('[data-product-gallery-viewport]');
    this.navigation = this.el.querySelector('[data-product-gallery-navigation]');
    this.masonryContainer = this.el.querySelector('[data-masonry-gallery]');
    this.figures = this.el.querySelectorAll('[data-product-gallery-figure]');
    this.initMasonry = this._initProductMasonry.bind(this);
    this.events = new EventHandler/* default */.Z();

    if (this.viewport) {
      this.selected = {
        figure: this.viewport.querySelector('[data-product-gallery-selected="true"]'),
        thumbnail: this.navigation ? this.navigation.querySelector('[data-product-gallery-selected="true"]') : null
      };
    }

    var features = [];

    if (this.el.querySelector('[data-media-type="model"]')) {
      features.push({
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: this._onModelLibraryLoad.bind(this)
      });
      features.push({
        name: 'shopify-xr',
        version: '1.0'
      });
    }

    if (this.el.querySelector('[data-media-type="video"]')) {
      Promise.all([new Promise(function (resolve) {
        if (!document.querySelector('#plyr-stylesheet')) {
          var link = document.createElement('link');
          link.setAttribute('id', 'plyr-stylesheet');
          link.setAttribute('rel', 'stylesheet');
          link.setAttribute('href', 'https://cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.css');
          link.onload = resolve;
          document.body.appendChild(link);
        } else {
          resolve();
        }
      }), new Promise(function (resolve) {
        features.push({
          name: 'video-ui',
          version: '1.0',
          onLoad: resolve
        });
      })]).then(this._onVideoLibraryLoad.bind(this));
    }

    youtubeIframeAPIHelper_load().then(this._onExternalVideoLibraryLoad.bind(this));

    if (features.length) {
      Shopify.loadFeatures(features);
    }

    this._registerEvents();

    this._initLayout();
  }

  ProductGallery_createClass(ProductGallery, [{
    key: "_registerEvents",
    value: function _registerEvents() {
      var _this = this;

      if (this.el.querySelector('[data-media-type="model"]')) {
        this.events.register(this.viewport, 'click', function (e) {
          if ('shopifyXr' in e.target.dataset) {
            _this._onViewInYourSpaceClick(e.target);
          }
        });
      }

      if (this.layout === 'masonry') {
        this.events.register(window, 'resize', function (e) {
          return _this.initMasonry(e);
        });
      }

      dist_index_es.watch(this.el);
    }
  }, {
    key: "_initLayout",
    value: function _initLayout() {
      var _this2 = this;

      if (this.layout === 'masonry') {
        this._initProductMasonry();
      } else if (this.layout === 'slideshow') {
        this.slideshow = new ProductSlideshow({
          el: this.el
        });

        if (this.navigation) {
          this.thumbnails = this.navigation.querySelectorAll('[data-product-gallery-thumbnail]');

          this.onThumbnailClick = function (e) {
            return _this2._selectMediaByIndex(e.currentTarget.dataset.productGalleryThumbnail);
          };

          this.thumbnails.forEach(function (thumbnail) {
            return _this2.events.register(thumbnail, 'click', _this2.onThumbnailClick);
          });
        }

        if (this.settings.enable_zoom && this.el.querySelectorAll('[data-media-type="image"]').length > 0) {
          this.zoomView = new ImageZoom({
            viewport: this.viewport,
            images: this.settings.images_json
          });
        }
      }
    }
  }, {
    key: "selectMediaByVariant",
    value: function selectMediaByVariant(variant) {
      if (!variant || !variant.featured_media) return;

      if (this.slideshow) {
        var figure = this.viewport.querySelector("[data-media=\"".concat(variant.featured_media.id, "\"]"));
        this.slideshow.selectThumbnail(variant.featured_media.id);

        this._selectMediaByIndex(figure.dataset.productGalleryFigure);
      } else if (this.flickity) {
        var slideIndex = this.el.querySelector("[data-media=\"".concat(variant.featured_media.id, "\"]")).dataset.productGalleryFigure;
        this.flickity.select(parseInt(slideIndex, 10));
      }
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.unregisterAll();
      this.media.forEach(function (m) {
        return m.unload();
      });
      this.media = [];

      if (this.productMasonryLayout) {
        this.productMasonryLayout.unload();
        this.productMasonryLayout = null;
      }

      if (this.flickity) {
        this.flickity.destroy();
        this.flickity = null;
        this.flickityEvents = [];
      }

      if (this.imageZoom) {
        this.imageZoom.unload();
      }

      this.el.innerHTML = this.initialGallery;
    }
  }, {
    key: "_onModelLibraryLoad",
    value: function _onModelLibraryLoad() {
      var _this3 = this;

      if (!Shopify.ModelViewerUI) return;
      if (this.modelLoaded) return;
      this.el.querySelectorAll('[data-media-type="model"]').forEach(function (figure) {
        var controls = ['zoom-in', 'zoom-out'];
        var productGalleryFigure = figure.dataset.productGalleryFigure;
        if (document.fullscreenEnabled) controls.push('fullscreen');

        var onPlayListener = function onPlayListener() {
          if (_this3.flickity) {
            _this3.flickity.unbindDrag();
          }
        };

        var onPauseListener = function onPauseListener() {
          if (_this3.flickity) {
            _this3.flickity.bindDrag();
          }
        };

        var modelViewer = figure.querySelector('model-viewer');

        if (modelViewer) {
          var player = new Shopify.ModelViewerUI(figure.querySelector('model-viewer'), {
            controls: controls
          });
          _this3.models[productGalleryFigure] = player;

          _this3.media.push({
            type: 'model',
            figure: figure,
            player: player,
            focus: function focus() {},
            restart: function restart() {},
            pause: function pause() {
              return player.pause();
            },
            play: function play() {
              return player.play();
            },
            unload: function unload() {}
          });

          if (_this3.flickity) {
            _this3.events.register(modelViewer, 'shopify_model_viewer_ui_toggle_play', onPlayListener);

            _this3.events.register(modelViewer, 'shopify_model_viewer_ui_toggle_pause', onPauseListener);

            _this3.flickity.resize();
          }
        }
      });

      if (this.productMasonryLayout) {
        this.productMasonryLayout.layout();
      }

      this.modelLoaded = true;
    }
  }, {
    key: "_onViewInYourSpaceClick",
    value: function _onViewInYourSpaceClick(target) {
      if (target.dataset.shopifyModel3dId === this.selected.figure.dataset.media) return;
      var figure = this.viewport.querySelector("[data-media=\"".concat(target.dataset.shopifyModel3dId, "\"]"));

      this._selectMediaByEl(figure);
    }
  }, {
    key: "_selectMediaByEl",
    value: function _selectMediaByEl(el) {
      this._selectMediaByIndex(parseInt(el.dataset.productGalleryFigure, 10));
    }
  }, {
    key: "_onVideoLibraryLoad",
    value: function _onVideoLibraryLoad() {
      var _this4 = this;

      if (!Shopify.Plyr) return;
      if (this.videoLoaded && this.settings.isQuickshop) return;
      var videoFigures = this.el.querySelectorAll('[data-media-type="video"]');

      var _loop = function _loop(i) {
        var videoEl = videoFigures[i];
        var player = new Shopify.Plyr(videoEl.querySelector('video'), {
          loop: {
            active: _this4.settings.enable_video_looping
          }
        });
        var plyrEl = videoEl.querySelector('.plyr');
        var video = {
          type: 'video',
          figure: videoEl,
          player: player,
          focus: function focus() {
            return plyrEl.focus();
          },
          restart: function restart() {
            player.restart();
            player.play();
          },
          pause: function pause() {
            return player.pause();
          },
          play: function play() {
            return player.play();
          },
          unload: function unload() {
            return player.destroy();
          }
        };

        _this4.events.register(videoEl, 'play', function () {
          return _this4._pauseMedia(video);
        });

        _this4.media.push(video);

        if (_this4.flickity) {
          _this4.flickity.resize();
        }
      };

      for (var i = 0; i < videoFigures.length; i++) {
        _loop(i);
      }

      if (this.productMasonryLayout && this.settings.isQuickshop) {
        setTimeout(function () {
          _this4.productMasonryLayout.layout();
        }, 100);
      } else if (this.productMasonryLayout && !this.settings.isQuickshop) {
        this.productMasonryLayout.layout();
      }

      this.videoLoaded = true;
    }
  }, {
    key: "_onExternalVideoLibraryLoad",
    value: function _onExternalVideoLibraryLoad() {
      var _this5 = this;

      if (!window.YT) return;
      if (this.externalVideoLoaded && this.settings.isQuickshop) return;
      var videoFigures = this.el.querySelectorAll('[data-media-type="external_video"]');

      for (var i = 0; i < videoFigures.length; i++) {
        var videoEl = videoFigures[i];
        var ytIframe = videoEl.querySelector('iframe');

        if (ytIframe) {
          (function () {
            var player = new YT.Player(ytIframe);
            var video = {
              type: 'video',
              figure: videoEl,
              player: player,
              focus: function focus() {
                return player.getIframe().focus();
              },
              restart: function restart() {
                player.seekTo(0);
                player.playVideo();
              },
              pause: function pause() {
                return player.pauseVideo();
              },
              play: function play() {
                return player.playVideo();
              },
              unload: function unload() {}
            };

            _this5.events.register(player, 'onStateChange', function (_ref) {
              var data = _ref.data;

              if (data === YT.PlayerState.ENDED && _this5.settings.enable_video_looping) {
                video.restart();
              } else if (data === YT.PlayerState.PLAYING) {
                _this5._pauseMedia(video);
              }
            });

            _this5.media.push(video);
          })();
        }

        if (this.flickity) {
          this.flickity.resize();
        }
      }

      if (this.productMasonryLayout && this.settings.isQuickshop) {
        setTimeout(function () {
          _this5.productMasonryLayout.layout();
        }, 100);
      } else if (this.productMasonryLayout && !this.settings.isQuickshop) {
        this.productMasonryLayout.layout();
      }

      this.externalVideoLoaded = true;
    }
  }, {
    key: "_onMediaSelect",
    value: function _onMediaSelect(media) {
      if (!media) return;

      switch (media.type) {
        case 'video':
          media.focus();

          if (this.settings.enable_video_autoplay && !scripts_themeUtils.isSmall() && this.layout !== 'list' && this.layout !== 'masonry') {
            media.play();
          }

          break;

        case 'model':
          if (document.querySelector('html').classList.contains('no-touch')) {
            media.play();
          }

          break;

        default:
          break;
      }
    }
  }, {
    key: "_pauseMedia",
    value: function _pauseMedia() {
      var excludeMedia = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.media.forEach(function (m) {
        if (m !== excludeMedia) {
          m.pause();
        }
      });
    }
  }, {
    key: "_selectMediaByIndex",
    value: function _selectMediaByIndex(index) {
      var _this6 = this;

      if (this.layout !== 'slideshow') return;
      var figure = this.figures[index];
      this.selected.figure.dataset.productGallerySelected = false;
      this.selected.figure.setAttribute('aria-hidden', true);
      this.selected.figure = figure;
      this.selected.figure.dataset.productGallerySelected = true;
      this.selected.figure.setAttribute('aria-hidden', false);

      if (this.navigation) {
        var thumbnail = this.thumbnails[index];
        this.selected.thumbnail.dataset.productGallerySelected = false;
        this.selected.thumbnail = thumbnail;
        this.selected.thumbnail.dataset.productGallerySelected = true;
      }

      this._pauseMedia();

      this._onMediaSelect(this.media.filter(function (m) {
        return m.figure === _this6.selected.figure;
      })[0]);

      if (this.zoomView && figure.dataset.mediaType === 'image') {
        this.zoomView.prepareZoom(true);
      }
    }
  }, {
    key: "_initProductMasonry",
    value: function _initProductMasonry(e) {
      var _this7 = this;

      if (e && document.fullscreenElement) {
        return;
      } else if (e && !document.fullscreenElement) {
        if (this.productMasonryLayout) {
          this.productMasonryLayout.layout();
        }
      }

      if (scripts_themeUtils.isSmall()) {
        if (this.productMasonryLayout) {
          this.unload();
          this.el.setAttribute('style', '');

          this._registerEvents();
        }

        if (!this.flickity) {
          this._initProductFlickity();
        }
      } else {
        if (this.flickity) {
          this.unload();
          this.el.setAttribute('style', '');

          this._registerEvents();
        }

        if (!this.productMasonryLayout) {
          if (this.figures.length > 1) {
            this.productMasonryLayout = new MasonryGrid({
              el: this.el,
              settings: {
                itemSelector: '.product-gallery--viewport--figure',
                columnWidth: '[data-masonry-image-sizer]'
              }
            });
          }

          this._onVideoLibraryLoad();

          this._onExternalVideoLibraryLoad();

          this._onModelLibraryLoad();
        }

        if (this.productMasonryLayout && this.settings.isQuickshop) {
          setTimeout(function () {
            _this7.productMasonryLayout.layout();
          }, 100);
        } else if (this.productMasonryLayout && !this.settings.isQuickshop) {
          this.productMasonryLayout.layout();
        }
      }
    }
  }, {
    key: "_selectFlickitySlide",
    value: function _selectFlickitySlide(el) {
      var _this8 = this;

      if (el.hasAttribute('data-mobile-slider-button')) {
        if (el.dataset.mobileSliderButton === 'next') {
          this.flickity.next();
        } else {
          this.flickity.previous();
        }
      }

      if (el.hasAttribute('data-mobile-slider-dot')) {
        this.flickity.select(parseInt(el.dataset.slideDotIndex, 10));
      }

      this._pauseMedia();

      this._onMediaSelect(this.media.filter(function (m) {
        return m.figure === _this8.flickity.selectedElement;
      })[0]);
    }
  }, {
    key: "_selectFlickityNav",
    value: function _selectFlickityNav() {
      var _this9 = this;

      this.pageDots.forEach(function (dotEl) {
        if (parseInt(dotEl.dataset.slideDotIndex, 10) === _this9.flickity.selectedIndex) {
          dotEl.classList.add('selected');
        } else {
          dotEl.classList.remove('selected');
        }
      });
      this.flickityNavButtons.forEach(function (navEl) {
        if (navEl.dataset.mobileSliderButton === 'prev' && _this9.flickity.selectedIndex === 0) {
          navEl.disabled = true;
        } else if (navEl.dataset.mobileSliderButton === 'next' && _this9.flickity.selectedIndex === _this9.flickity.slides.length - 1) {
          navEl.disabled = true;
        } else {
          navEl.disabled = false;
        }
      });
    }
  }, {
    key: "_initProductFlickity",
    value: function _initProductFlickity() {
      var _this10 = this;

      if (this.figures.length <= 1) return;

      if (!this.flickity) {
        this.flickity = new (js_default())(this.el, {
          cellAlign: 'left',
          cellSelector: '.product-gallery--viewport--figure',
          contain: false,
          percentPosition: false,
          prevNextButtons: true,
          adaptiveHeight: true,
          setGallerySize: true,
          pageDots: true,
          lazyLoad: false
        });
        this.pageDots = this.productContainer.querySelectorAll('[data-mobile-slider-dot]');
        this.flickityNavButtons = this.productContainer.querySelectorAll('[data-mobile-slider-button]');
        this.flickity.on('select', function () {
          return _this10._selectFlickityNav();
        });
        this.flickityNavButtons.forEach(function (el) {
          _this10.flickityEvents.push(_this10.events.register(el, 'click', function () {
            return _this10._selectFlickitySlide(el);
          }));
        });
        this.pageDots.forEach(function (el) {
          _this10.flickityEvents.push(_this10.events.register(el, 'click', function () {
            return _this10._selectFlickitySlide(el);
          }));
        });
        this.flickityEvents.push(this.events.register(this.el, 'rimg:load', function () {
          return _this10.flickity.resize();
        })); // Flickity controls the pointerdown event which prevents model-viewer-ui from
        // triggering .play() on mouseup. This returns this functionality.

        this.flickity.on('staticClick', function (event, pointer, cellElement) {
          var figure = cellElement;

          if (figure && _this10.models[figure.dataset.productGalleryFigure]) {
            var model = _this10.models[figure.dataset.productGalleryFigure];
            model.play();
          }
        });
      }

      this._onVideoLibraryLoad();

      this._onExternalVideoLibraryLoad();

      this._onModelLibraryLoad();
    }
  }]);

  return ProductGallery;
}();


;// CONCATENATED MODULE: ./source/scripts/components/Modal.js
function Modal_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { Modal_ownKeys(Object(source), true).forEach(function (key) { Modal_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { Modal_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function Modal_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function Modal_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Modal_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Modal_createClass(Constructor, protoProps, staticProps) { if (protoProps) Modal_defineProperties(Constructor.prototype, protoProps); if (staticProps) Modal_defineProperties(Constructor, staticProps); return Constructor; }



var Modal = /*#__PURE__*/function () {
  function Modal() {
    var _this = this;

    var component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    Modal_classCallCheck(this, Modal);

    this.options = options;
    this.el = component.el;
    this.modalInner = this.el.querySelector('[data-modal-inner]');
    this.contents = this.el.querySelector('[data-modal-contents]');
    this.mobileFriendly = 'modalMobileFriendly' in this.el.dataset;
    document.querySelector('[data-modal-close]').addEventListener('click', function () {
      return _this.close();
    });
    this.selectors = {
      open: 'modal-opened',
      visible: 'modal-visible',
      active: 'modal-active',
      scrollLock: 'scroll-locked'
    };
    var defaultCallbacks = {
      onOpen: function onOpen() {
        return {};
      },
      onClose: function onClose() {
        return {};
      }
    };
    this.callbacks = _objectSpread(_objectSpread({}, defaultCallbacks), component.callbacks);
  } // Manually open a modal.


  Modal_createClass(Modal, [{
    key: "open",
    value: function open() {
      var _this2 = this;

      this.el.classList.add(this.selectors.open);
      window.addEventListener('resize', function () {
        return _this2._resize();
      }); // Use onOpen to insert contents into modal

      return this.callbacks.onOpen({
        modal: this.el,
        contents: this.contents
      });
    } // Close modal, and clean up

  }, {
    key: "close",
    value: function close() {
      var _this3 = this;

      this.el.classList.remove(this.selectors.active);
      this.el.classList.remove(this.selectors.visible);
      this.el.classList.remove(this.selectors.open);
      document.body.classList.remove(this.selectors.scrollLock);
      this.contents.innerHTML = '';
      this.callbacks.onClose();
      window.removeEventListener('resize', function () {
        return _this3._resize();
      });
    }
    /*
              Make a modal visible after content has been added
              */

  }, {
    key: "showModal",
    value: function showModal() {
      var _this4 = this;

      // Wait on animation frame after opening to ensure animations are played
      window.requestAnimationFrame(function () {
        document.body.classList.add(_this4.selectors.scrollLock);

        if (_this4.options && _this4.options.reposition && _this4.options.reposition !== false) {
          _this4._position();
        }

        _this4.el.addEventListener('transitionend', function () {
          return _this4.el.classList.add(_this4.selectors.active);
        });

        _this4.el.classList.add(_this4.selectors.visible);
      });
    }
  }, {
    key: "_resize",
    value: function _resize() {
      if (this.options && this.options.reposition && this.options.reposition !== false) {
        this._position();
      } // Some modals shouldn't be visible on mobile


      if (!this.mobileFriendly) {
        var windowWidth = scripts_themeUtils.windowWidth();

        if (windowWidth > scripts_themeUtils.breakpoints.small) {
          return;
        }

        this.close();
      }
    }
    /*
              Center modal vertically and horizontally
              */

  }, {
    key: "_position",
    value: function _position() {
      var _this$modalInner$getB = this.modalInner.getBoundingClientRect(),
          width = _this$modalInner$getB.width,
          height = _this$modalInner$getB.height;

      this.modalInner.style.marginTop = "".concat(-(height / 2), "px");
      this.modalInner.style.marginLeft = "".concat(-(width / 2), "px");
    }
  }]);

  return Modal;
}();


;// CONCATENATED MODULE: ./source/scripts/components/Product.js
function Product_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Product_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Product_createClass(Constructor, protoProps, staticProps) { if (protoProps) Product_defineProperties(Constructor.prototype, protoProps); if (staticProps) Product_defineProperties(Constructor, staticProps); return Constructor; }












var Product = /*#__PURE__*/function () {
  function Product(el, options) {
    var _this = this;

    Product_classCallCheck(this, Product);

    this.positionProductInfo = this.positionProductInfo.bind(this);
    this.el = el;
    this.surfacePickUp = new shopify_surface_pick_up_dist_index_es(this.el.querySelector('[data-surface-pick-up]'));
    this.surfacePickUp.onModalRequest(function (contents) {
      _this.modal = new Modal({
        el: _this.el.querySelector('[data-modal-id="surface-pick-up"]'),
        callbacks: {
          onOpen: function onOpen(_ref) {
            var modal = _ref.modal;
            var modalHeader = modal.querySelector('[data-modal-header]');
            var modalContents = modal.querySelector('[data-modal-contents]');

            if (_this.product && _this.variantHelpers) {
              var variant = _this.variantHelpers.getVariantFromOptions(_this.variantHelpers.getCurrentOptions());

              modalHeader.innerHTML = "<h2 class=\"surface-pick-up-modal__header\">".concat(_this.product.title, "</h2><span class=\"surface-pick-up-modal__subtitle\">").concat(variant.title, "</span>");
            }

            modalContents.innerHTML = contents;
          }
        }
      }, {
        reposition: false
      });

      _this.modal.open();

      _this.modal.showModal();
    }); // Set up conditional options

    this.product = options.product;
    this.productSettings = options.product_settings;
    this.labels = JSON.parse(document.querySelector('[data-product-success-labels]').innerHTML);
    this.imagesLayout = options.images_layout;
    this.isQuickshop = options.isQuickshop;
    this.enableZoom = options.enable_zoom;
    this.enableVideoAutoplay = options.enable_video_autoplay;
    this.enableVideoLooping = options.enable_video_looping;
    this.enableCartRedirection = options.enable_cart_redirection;
    this.enableFixedPositioning = options.enable_fixed_positioning;
    this.variantHelpers = null;
    this.productMasonryLayout = null;
    this.rteViews = [];
    this.selectViews = [];
    this.productForm = this.el.querySelector('[data-product-form]');
    this.productContainer = this.el.querySelector('.product');
    this.productImages = this.el.querySelector('.product-images');
    this.productDetailsWrapper = this.el.querySelector('.product-details-wrapper');
    this.productDetails = this.el.querySelector('.product-details');
    this.productMessages = this.el.querySelector('.product-message');
    this.addToCartBtn = this.el.querySelector('.add-to-cart');
    this.images = JSON.parse(this.el.querySelector('[data-images]').innerText);
    this.smallGallery = scripts_themeUtils.isSmall();
    this.productGallery = null;
    this.unitPrice = this.el.querySelector('[data-unit-price]');
    this.taxLine = this.el.querySelector('[data-tax-line]');

    this._initProductGallery();

    this.reloadGallery = this._reloadGallery.bind(this);
    window.addEventListener('resize', this.reloadGallery);
    this.el.querySelectorAll('.rte').forEach(function (rte) {
      return _this.rteViews.push(new RTE({
        el: rte
      }));
    });
    this.el.querySelectorAll('select').forEach(function (select) {
      if (!select.hasAttribute('data-select-ignore')) {
        _this.selectViews.push(new Select({
          el: select
        }));
      }
    });
    this.setupVariants();

    if (this.enableFixedPositioning) {
      this.positionProductInfo();
    }

    this.addToCartBtn.addEventListener('click', function (event) {
      return _this.addToCart(event);
    });

    if (Shopify.PaymentButton != null) {
      Shopify.PaymentButton.init();
    }
  }

  Product_createClass(Product, [{
    key: "_initProductGallery",
    value: function _initProductGallery() {
      this.productGallery = new ProductGallery(this.el.querySelector('[data-product-gallery]'), {
        product_container: this.productContainer,
        images_layout: this.imagesLayout,
        images_json: this.images,
        enable_zoom: this.enableZoom,
        enable_video_looping: this.enableVideoLooping,
        enable_video_autoplay: this.enableVideoAutoplay,
        isQuickshop: this.isQuickshop
      });
    }
  }, {
    key: "_reloadGallery",
    value: function _reloadGallery() {
      if (scripts_themeUtils.isSmall() && !this.smallGallery) {
        this.productGallery.unload();
        this.productGallery = null;

        this._initProductGallery();

        this.smallGallery = true;
      }

      if (!scripts_themeUtils.isSmall() && this.smallGallery) {
        this.productGallery.unload();
        this.productGallery = null;

        this._initProductGallery();

        this.smallGallery = false;
      }
    }
  }, {
    key: "unload",
    value: function unload() {
      clearTimeout(this.positionTimeout);

      if (this.variantHelpers != null) {
        this.variantHelpers.unload();
      }

      if (this.productGallery) {
        this.productGallery.unload();
      }

      if (this.rteViews.length > 0) {
        this.rteViews = [];
      }

      if (this.selectViews.length > 0) {
        this.selectViews = [];
      }

      window.removeEventListener('resize', this.reloadGallery);
    }
  }, {
    key: "setupVariants",
    value: function setupVariants() {
      var _this2 = this;

      var event = document.createEvent('Event');
      var variantDropdowns = this.el.querySelectorAll('[data-option-select]');
      this.variantHelpers = new VariantHelper({
        addToCartButton: this.el.querySelector('.add-to-cart'),
        priceFields: this.el.querySelectorAll('.product-price'),
        productForm: this.el.querySelector('[data-product-form]'),
        productGallery: this.productGallery,
        productThumbnails: this.el.querySelectorAll('.product-thumbnails img'),
        selector: variantDropdowns,
        type: 'select',
        productJSON: this.product,
        productSettings: this.productSettings,
        unitPrice: this.unitPrice,
        taxLine: this.taxLine
      });
      this.variantHelpers.onVariantChange(function (v) {
        var id = v ? v.id : null;

        _this2.surfacePickUp.load(id);
      });
      event.initEvent('change', true, true);
      variantDropdowns.forEach(function (variantDropdown) {
        return variantDropdown.dispatchEvent(event);
      });
    }
  }, {
    key: "positionProductInfo",
    value: function positionProductInfo() {
      var detailsHeight = this.productDetails.getBoundingClientRect().height;
      var viewportHeight = window.innerHeight;

      if (document.documentElement.clientHeight < window.innerHeight) {
        viewportHeight = document.documentElement.clientHeight;
      }

      if (window.innerWidth > 770 && viewportHeight > detailsHeight) {
        this.triggerFixedProductInfo();
      } else {
        this.productDetails.classList.remove('product-details-fixed');
        this.productDetails.classList.remove('product-details-absolute');
      }

      return requestAnimationFrame(this.positionProductInfo);
    }
  }, {
    key: "triggerFixedProductInfo",
    value: function triggerFixedProductInfo() {
      if (this.imagesLayout !== 'list') {
        return;
      }

      var _window = window,
          scrollTop = _window.scrollTop;

      var _this$productImages$g = this.productImages.getBoundingClientRect(),
          imagesHeight = _this$productImages$g.height,
          imagesOffsetTop = _this$productImages$g.top;

      var imagesOffsetBottom = imagesOffsetTop + imagesHeight;
      var detailsWrapperOffset = this.productDetailsWrapper.getBoundingClientRect().top;

      var _this$productDetails$ = this.productDetails.getBoundingClientRect(),
          detailsHeight = _this$productDetails$.height,
          detailsOffsetTop = _this$productDetails$.top;

      var detailsOffsetBottom = detailsOffsetTop + detailsHeight;

      if (detailsHeight < imagesHeight) {
        // If we're far enough down the page that the content is near the window top
        if (detailsWrapperOffset - scrollTop < 0) {
          // Check if our details / images are out of line but low enough to "fix"
          if (detailsOffsetBottom < imagesOffsetBottom || scrollTop < detailsOffsetTop) {
            this.productDetails.classList.remove('product-details-absolute');
            this.productDetails.classList.add('product-details-fixed');
          }

          var _this$productDetails$2 = this.productDetails.getBoundingClientRect();

          detailsHeight = _this$productDetails$2.height;
          detailsOffsetTop = _this$productDetails$2.top;
          detailsOffsetBottom = detailsOffsetTop + detailsHeight; // If we're far enough down then this positions items near the bottom

          if (detailsOffsetBottom >= imagesOffsetBottom || scrollTop >= detailsOffsetTop) {
            this.productDetails.classList.remove('product-details-fixed');
            this.productDetails.classList.add('product-details-absolute');
          }
        } else {
          this.productDetails.classList.remove('product-details-fixed');
          this.productDetails.classList.remove('product-details-absolute');
        }
      }
    }
  }, {
    key: "addToCart",
    value: function addToCart(e) {
      var _this3 = this;

      if (this.enableCartRedirection) {
        return;
      }

      e.preventDefault();
      this.productMessages.innerHTML = '';
      var formData = new FormData(this.productForm);
      var request = new XMLHttpRequest();
      request.open('POST', window.Theme.routes.cart_add_url);
      request.setRequestHeader('Accept', 'application/json');
      request.addEventListener('error', function (error) {
        return _this3.handleErrors(error);
      });

      request.onreadystatechange = function () {
        var readyState = request.readyState,
            status = request.status,
            responseText = request.responseText;

        if (readyState === 4 && status === 200) {
          var item = JSON.parse(responseText);
          var message = window.Theme.addToCartSuccess.replace('**product**', item.title).replace('**cart_link**', "<a href=\"".concat(window.Theme.routes.cart_url, "\">").concat(_this3.labels.cartLink, "</a>")).replace('**continue_link**', "<a href=\"".concat(window.Theme.routes.all_products_collection_url, "\">").concat(_this3.labels.continueLink, "</a>")).replace('**checkout_link**', "<form action=\"".concat(window.Theme.routes.cart_url, "\" method=\"POST\"><button type=\"submit\" name=\"checkout\">").concat(_this3.labels.checkoutLink, "</button></form>"));
          setTimeout(function () {
            _this3.productMessages.innerHTML = message;

            _this3.productMessages.classList.add('success-message');

            _this3.productMessages.classList.remove('error-message');

            _this3.updateCart(item);
          }, 500);
        }
      };

      request.send(formData);
    }
  }, {
    key: "updateCart",
    value: function updateCart() {
      document.querySelector('.mini-cart').classList.remove('empty');
      var miniCartItemWrapper = document.querySelector('.mini-cart-item-wrapper');
      var cartCount = document.querySelector('.cart-count-number');
      shopify_asyncview_dist_index_es.load(window.Theme.routes.cart_url, {
        view: '_mini-ajax'
      }).then(function (_ref2) {
        var data = _ref2.data,
            html = _ref2.html;
        var updatedMiniCart = document.createElement('div');
        updatedMiniCart.innerHTML = html.miniCart;
        cartCount.innerText = data.itemCount;
        morphdom_esm(miniCartItemWrapper, updatedMiniCart.querySelector('.mini-cart-item-wrapper'), {
          onBeforeElUpdated: function onBeforeElUpdated(fromEl, toEl) {
            if (fromEl.tagName === 'IMG' && fromEl.src === toEl.src) {
              return false;
            }

            return true;
          }
        });
      });
      dist_index_es.watch(miniCartItemWrapper);
    }
  }, {
    key: "handleErrors",
    value: function handleErrors(error) {
      var _this4 = this;

      return setTimeout(function () {
        _this4.productMessage.innerHTML = JSON.parse(error.responseText).description;

        _this4.productMessage.classList.add('error-message');

        _this4.productMessage.classList.remove('success-message');
      }, 1000);
    }
  }]);

  return Product;
}();


;// CONCATENATED MODULE: ./source/scripts/components/Quickshop.js
function Quickshop_slicedToArray(arr, i) { return Quickshop_arrayWithHoles(arr) || Quickshop_iterableToArrayLimit(arr, i) || Quickshop_unsupportedIterableToArray(arr, i) || Quickshop_nonIterableRest(); }

function Quickshop_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function Quickshop_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Quickshop_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Quickshop_arrayLikeToArray(o, minLen); }

function Quickshop_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function Quickshop_iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function Quickshop_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function Quickshop_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Quickshop_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Quickshop_createClass(Constructor, protoProps, staticProps) { if (protoProps) Quickshop_defineProperties(Constructor.prototype, protoProps); if (staticProps) Quickshop_defineProperties(Constructor, staticProps); return Constructor; }



var Quickshop = /*#__PURE__*/function () {
  function Quickshop() {
    Quickshop_classCallCheck(this, Quickshop);

    this.el = document.querySelector('[data-quickshop]');
    this.contentEl = document.querySelector('[data-quickshop-content]');
    this.closeEl = document.querySelector('[data-quickshop-close]');
    this.injectEl = this.el.querySelector('[data-quickshop-product-inject]');
    this.settingsSha256 = this.el.getAttribute('data-quickshop-settings-sha256');
    this.useCaching = !(window.Shopify && window.Shopify.designMode);
    this.deferred = {};
    this.onContentClick = this._onContentClick.bind(this);
    this.onCloseClick = this.close.bind(this);
  }

  Quickshop_createClass(Quickshop, [{
    key: "load",
    value: function load(url, productSha256) {
      var _this = this;

      var data;

      if (url in this.deferred) {
        return this.deferred[url];
      }

      this.deferred[url] = new Promise(function (resolve, reject) {
        if (_this.useCaching) {
          data = sessionStorage.getItem(url);

          if (data) {
            var deserialized = JSON.parse(data);

            if (productSha256 === deserialized.options.product_sha256 && _this.settingsSha256 === deserialized.options.settings_sha256) {
              delete _this.deferred[url];
              return resolve(deserialized);
            }
          }
        }

        var _url$split = url.split('?'),
            _url$split2 = Quickshop_slicedToArray(_url$split, 2),
            baseUrl = _url$split2[0],
            params = _url$split2[1];

        var request = new XMLHttpRequest();
        request.open('GET', "".concat(baseUrl, "?").concat(params ? "".concat(params, "&&view=ajax") : 'view=ajax'), true);
        request.responseType = 'text';

        request.onload = function () {
          var el = document.createElement('div');
          el.innerHTML = request.response;
          var options = JSON.parse(el.querySelector('[data-product-options]').innerHTML);
          var html = el.querySelector('[data-product-html]').innerHTML;

          if (_this.useCaching) {
            try {
              sessionStorage.setItem(url, JSON.stringify({
                options: options,
                html: html
              }));
            } catch (_unused) {}
          }

          delete _this.deferred[url];
          resolve({
            options: options,
            html: html
          });
        };

        request.onerror = function () {
          delete _this.deferred[url];
          reject();
        };

        request.send();
      });
      return this.deferred[url];
    }
  }, {
    key: "open",
    value: function open(url, productSha256) {
      var _this2 = this;

      this.el.addEventListener('click', this.onCloseClick);
      this.contentEl.addEventListener('click', this.onContentClick);
      this.closeEl.addEventListener('click', this.onCloseClick);
      this.el.classList.add('quickshop-visible');
      return this.load(url, productSha256).then(function (data) {
        _this2.injectEl.innerHTML = data.html;
        _this2.product = new Product(_this2.injectEl, data.options);

        _this2.el.classList.add('quickshop-loaded');
      });
    }
  }, {
    key: "close",
    value: function close() {
      if (this.product != null) {
        this.product.unload();
      }

      this.el.removeEventListener('click', this.onCloseClick);
      this.contentEl.removeEventListener('click', this.onContentClick);
      this.closeEl.removeEventListener('click', this.onCloseClick);
      this.el.classList.remove('quickshop-loaded');
      return this.el.classList.remove('quickshop-visible');
    }
  }, {
    key: "unload",
    value: function unload() {
      return this.close();
    }
  }, {
    key: "_onContentClick",
    value: function _onContentClick(e) {
      return e.stopPropagation();
    }
  }]);

  return Quickshop;
}();


;// CONCATENATED MODULE: ./source/scripts/components/ProductListItem.js
function ProductListItem_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProductListItem_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProductListItem_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductListItem_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductListItem_defineProperties(Constructor, staticProps); return Constructor; }



var ProductListItem = /*#__PURE__*/function () {
  function ProductListItem(_ref) {
    var _this = this;

    var el = _ref.el;

    ProductListItem_classCallCheck(this, ProductListItem);

    this.el = el;
    this.el.querySelector('.product-list-item-thumbnail').addEventListener('click', function (event) {
      return _this.redirectToProduct(event);
    });
    this.productHover = document.querySelector('[data-product-hover]').dataset.productHover;
    this.quickshopTrigger = this.el.querySelector('.quick-shop-modal-trigger');

    if (this.productHover === 'quick-shop' && this.quickshopTrigger !== null) {
      this.quickshop = new Quickshop();
      this.quickshopTrigger.addEventListener('click', function (event) {
        return _this.openQuickShop(event);
      });
      this.quickshopTrigger.addEventListener('mouseover', function (event) {
        return _this.preloadQuickshop(event);
      });
    }
  }

  ProductListItem_createClass(ProductListItem, [{
    key: "remove",
    value: function remove() {
      var _this2 = this;

      if (this.quickshop) {
        this.quickshop.unload();
        this.quickshopTrigger.removeEventListener('click', function (event) {
          return _this2.openQuickShop(event);
        });
        this.quickshopTrigger.removeEventListener('mouseover', function (event) {
          return _this2.preloadQuickshop(event);
        });
      }

      this.el.querySelector('.product-list-item-thumbnail').removeEventListener('click', function (event) {
        return _this2.redirectToProduct(event);
      });
    }
  }, {
    key: "redirectToProduct",
    value: function redirectToProduct(_ref2) {
      var target = _ref2.target;
      var url = !target.classList.contains('quick-shop-modal-trigger') ? target.dataset.url : null;

      if (url) {
        window.location = url;
      }
    }
  }, {
    key: "openQuickShop",
    value: function openQuickShop(e) {
      var productUrl = e.currentTarget.getAttribute('data-product-url');
      var productSha256 = e.currentTarget.getAttribute('data-product-sha256');
      return this.quickshop.open(productUrl, productSha256);
    }
  }, {
    key: "preloadQuickshop",
    value: function preloadQuickshop(e) {
      var productUrl = e.currentTarget.getAttribute('data-product-url');
      var productSha256 = e.currentTarget.getAttribute('data-product-sha256');
      return this.quickshop.load(productUrl, productSha256);
    }
  }]);

  return ProductListItem;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/DynamicFeaturedCollection.js
function DynamicFeaturedCollection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DynamicFeaturedCollection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DynamicFeaturedCollection_createClass(Constructor, protoProps, staticProps) { if (protoProps) DynamicFeaturedCollection_defineProperties(Constructor.prototype, protoProps); if (staticProps) DynamicFeaturedCollection_defineProperties(Constructor, staticProps); return Constructor; }





var DynamicFeaturedCollection = /*#__PURE__*/function () {
  function DynamicFeaturedCollection(section) {
    DynamicFeaturedCollection_classCallCheck(this, DynamicFeaturedCollection);

    this.el = section.el;
    this._flickity = this._flickity.bind(this);
    this._destroyFlickity = this._destroyFlickity.bind(this);
    this.productViews = [];
    this.container = this.el.querySelector('[data-products-container]');
    this.slide = '.product-list-item';
    this.flickity = null;

    this._bindEvents();

    this._setupProducts();

    this._flickity();
  }

  DynamicFeaturedCollection_createClass(DynamicFeaturedCollection, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      window.removeEventListener('resize', scripts_themeUtils.debounce(this._flickity, 100));

      this._destroyFlickity();

      if (this.productViews.length) {
        // Destroy existing view listeners
        this.productViews.map(function (productView) {
          productView.remove();
        });
      }
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      window.addEventListener('resize', scripts_themeUtils.debounce(this._flickity, 100));
    }
  }, {
    key: "_setupProducts",
    value: function _setupProducts() {
      var _this = this;

      this.el.querySelectorAll('.product-list-item').forEach(function (productItem) {
        return _this.productViews.push(new ProductListItem({
          el: productItem
        }));
      });
    }
  }, {
    key: "_flickity",
    value: function _flickity() {
      if (!this.container) {
        return;
      } // If larger than 'small', destroy Flickity and exit


      if (!scripts_themeUtils.isSmall()) {
        this._destroyFlickity();

        return;
      } // If Flickity is initialised, exit


      if (this.flickity) {
        return;
      }

      this.flickity = new (js_default())(this.container, {
        cellAlign: 'left',
        cellSelector: this.slide,
        contain: false,
        prevNextButtons: false,
        pageDots: false,
        setGallerySize: false
      });

      this._flickityEvents();
    }
  }, {
    key: "_destroyFlickity",
    value: function _destroyFlickity() {
      var _this2 = this;

      if (this.flickity) {
        this.flickity.destroy();
        this.flickity = null;
        window.removeEventListener('resize', scripts_themeUtils.debounce(function () {
          var event = document.createEvent('Event');
          event.initEvent('home-featured-collections-height', true, true);

          _this2.container.dispatchEvent(event);
        }, 10));

        if (this.flickity) {
          this.container.removeEventListener('rimg:load', function () {
            return scripts_themeUtils.flickityResize(_this2.flickity);
          });
        }

        this.container.removeEventListener('home-featured-collections-height', function () {
          return scripts_themeUtils.flickityResize(_this2.flickity);
        });
      }
    }
  }, {
    key: "_flickityEvents",
    value: function _flickityEvents() {
      var _this3 = this;

      var event = document.createEvent('Event');
      event.initEvent('home-featured-collections-height', true, true); // Check for tallest slide at start of transition

      this.flickity.on('cellSelect', function () {
        return _this3.container.dispatchEvent(event);
      }); // Check for tallest slide at end of transition

      this.flickity.on('settle', function () {
        return _this3.container.dispatchEvent(event);
      });

      if (this.flickity) {
        this.container.addEventListener('rimg:load', function () {
          return scripts_themeUtils.flickityResize(_this3.flickity);
        });
      }

      this.container.addEventListener('home-featured-collections-height', function () {
        return scripts_themeUtils.flickityResize(_this3.flickity);
      }); // Sets the Slider to the height of the first slide

      this.container.dispatchEvent(event);
      window.addEventListener('resize', scripts_themeUtils.debounce(function () {
        return _this3.container.dispatchEvent(event);
      }, 10));
    }
  }]);

  return DynamicFeaturedCollection;
}();


;// CONCATENATED MODULE: ./source/scripts/components/MasonryVideo.js
function MasonryVideo_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function MasonryVideo_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function MasonryVideo_createClass(Constructor, protoProps, staticProps) { if (protoProps) MasonryVideo_defineProperties(Constructor.prototype, protoProps); if (staticProps) MasonryVideo_defineProperties(Constructor, staticProps); return Constructor; }




var MasonryVideo = /*#__PURE__*/function () {
  function MasonryVideo(el, event) {
    var _this = this;

    MasonryVideo_classCallCheck(this, MasonryVideo);

    this.el = el;
    this.modal = null;
    var target = event.currentTarget;
    var modalID = target.dataset.masonryVideo;
    var modalEl = this.el.querySelector("[data-modal-id=\"".concat(modalID, "\"]"));
    this.modal = new Modal({
      el: modalEl,
      callbacks: {
        onOpen: function onOpen(_ref) {
          var modal = _ref.modal,
              contents = _ref.contents;
          return _this._open({
            modal: modal,
            contents: contents
          });
        },
        onClose: function onClose() {
          return _this._close();
        }
      }
    });
    this.modal.open();
  }

  MasonryVideo_createClass(MasonryVideo, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.modal) {
        this.modal.close();
      }
    }
  }, {
    key: "_open",
    value: function _open(_ref2) {
      var modal = _ref2.modal,
          contents = _ref2.contents;
      var video = modal.querySelector('[data-masonry-video]');

      try {
        contents.innerHTML = JSON.parse(video.innerText);
        reframe_es(contents);
        reframe_es(contents.querySelectorAll('iframe'));
        this.modal.showModal();
      } catch (_unused) {
        console.warn('Unable to parse contents of video');
      }
    }
  }, {
    key: "_close",
    value: function _close() {
      this.modal = null;
    }
  }]);

  return MasonryVideo;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/DynamicMasonry.js
function DynamicMasonry_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DynamicMasonry_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DynamicMasonry_createClass(Constructor, protoProps, staticProps) { if (protoProps) DynamicMasonry_defineProperties(Constructor.prototype, protoProps); if (staticProps) DynamicMasonry_defineProperties(Constructor, staticProps); return Constructor; }



var DynamicMasonry = /*#__PURE__*/function () {
  function DynamicMasonry(section) {
    DynamicMasonry_classCallCheck(this, DynamicMasonry);

    this.el = section.el;
    this.masonryVideo = null;
    this.urls = this.el.querySelectorAll('[data-masonry-url]');
    this.videos = this.el.querySelectorAll('[data-masonry-video]');
    this._redirectMasonryFeatures = this._redirectMasonryFeatures.bind(this);
    this._masonryVideo = this._masonryVideo.bind(this);

    this._bindEvents();
  }

  DynamicMasonry_createClass(DynamicMasonry, [{
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this = this;

      this.urls.forEach(function (url) {
        return url.addEventListener('click', function (event) {
          return _this._redirectMasonryFeatures(event);
        });
      });
      this.videos.forEach(function (video) {
        return video.addEventListener('click', function (event) {
          return _this._masonryVideo(event);
        });
      });
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      var _this2 = this;

      if (this.masonryVideo != null) {
        this.masonryVideo.remove();
      }

      this.urls.forEach(function (url) {
        return url.removeEventListener('click', function (event) {
          return _this2._redirectMasonryFeatures(event);
        });
      });
      this.videos.forEach(function (video) {
        return video.removeEventListener('click', function (event) {
          return _this2._masonryVideo(event);
        });
      });
    }
  }, {
    key: "_redirectMasonryFeatures",
    value: function _redirectMasonryFeatures(e) {
      var currentTarget = e.currentTarget;
      if (!this.el.contains(currentTarget)) return;
      var masonryUrl = currentTarget.dataset.masonryUrl;

      if (masonryUrl !== '') {
        window.location = masonryUrl;
      }
    }
  }, {
    key: "_masonryVideo",
    value: function _masonryVideo(event) {
      this.masonryVideo = new MasonryVideo(this.el, event);
    }
  }]);

  return DynamicMasonry;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/DynamicPromotion.js
function DynamicPromotion_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DynamicPromotion_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DynamicPromotion_createClass(Constructor, protoProps, staticProps) { if (protoProps) DynamicPromotion_defineProperties(Constructor.prototype, protoProps); if (staticProps) DynamicPromotion_defineProperties(Constructor, staticProps); return Constructor; }



var DynamicPromotion = /*#__PURE__*/function () {
  function DynamicPromotion(section) {
    DynamicPromotion_classCallCheck(this, DynamicPromotion);

    this.el = section.el;
    this.adjustHeight = this.adjustHeight.bind(this);
    this._headerOffset = this._headerOffset.bind(this);
    this.header = document.querySelector('[data-section-type="header"]');
    this.parent = this.el.parentElement;
    this.wrapper = this.el.querySelector('[data-promotion-wrapper]');
    this.content = this.el.querySelector('[data-promotion-content]');
    this.image = this.el.querySelector('[data-promotion-image]');
    this.imageContainer = this.el.querySelector('[data-promotion-image-container]');
    this.isFullScreen = section.data.layout === 'full-screen';

    this._bindEvents();

    return this.adjustHeight();
  }

  DynamicPromotion_createClass(DynamicPromotion, [{
    key: "remove",
    value: function remove() {
      window.removeEventListener('resize', scripts_themeUtils.debounce(this.adjustHeight, 100));
      window.removeEventListener('scroll', scripts_themeUtils.debounce(this.adjustHeight, 10));
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.remove();
    }
  }, {
    key: "onSectionReorder",
    value: function onSectionReorder() {
      return this._headerOffset();
    }
  }, {
    key: "adjustHeight",
    value: function adjustHeight() {
      var heights = []; // An image can be shorter than text

      if (this.imageContainer) {
        if (this.content) {
          heights.push(this.content.getBoundingClientRect().height);
        }

        if (this.image) {
          heights.push(this.image.getBoundingClientRect().height);
        }

        var minHeight = Math.max.apply(null, heights);
        this.imageContainer.style.height = "".concat(minHeight, "px");
      }

      return this._headerOffset();
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      window.addEventListener('resize', scripts_themeUtils.debounce(this.adjustHeight, 100));
      window.addEventListener('scroll', scripts_themeUtils.debounce(this.adjustHeight, 10));
    } // Adjust container to compensate for header height if its in viewport

  }, {
    key: "_headerOffset",
    value: function _headerOffset() {
      var newHeight;

      if (!this.isFullScreen) {
        return;
      }

      var headerHeight = this.header.getBoundingClientRect().height;
      var headerScrolledHeight = this.header.querySelector('.navigation').getBoundingClientRect().height;
      var isFirstChild = this.parent.previousElementSibling === null;
      var isStickyEnabled = document.body.classList.contains('sticky-header');
      var maxHeight = window.innerHeight;

      if (scripts_themeUtils.isMedium()) {
        this.wrapper.style.height = '';
      } // If is first child, always make it full screen minus header height


      if (isFirstChild) {
        newHeight = maxHeight - headerHeight;
        this.wrapper.style.height = "".concat(newHeight, "px"); // Otherwise, if its larger than tablet, and sticky is enabled, take off nav height
      }

      if (!scripts_themeUtils.isMedium() && isStickyEnabled) {
        newHeight = maxHeight - headerScrolledHeight;
        this.wrapper.style.height = "".concat(newHeight, "px"); // Is not tablet, and header is not sticky, remove offset
      }

      this.wrapper.style.height = '';
    }
  }]);

  return DynamicPromotion;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/DynamicSlideshow.js
function DynamicSlideshow_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DynamicSlideshow_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DynamicSlideshow_createClass(Constructor, protoProps, staticProps) { if (protoProps) DynamicSlideshow_defineProperties(Constructor.prototype, protoProps); if (staticProps) DynamicSlideshow_defineProperties(Constructor, staticProps); return Constructor; }



var DynamicSlideshow = /*#__PURE__*/function () {
  function DynamicSlideshow(section) {
    DynamicSlideshow_classCallCheck(this, DynamicSlideshow);

    this.el = section.el;
    this.slideshow = this.el.querySelector('[data-slideshow]');
    this.flickity = null;
    this.slideCount = this.slideshow.querySelectorAll('[data-slideshow-slide]').length;
    this.autoplay = section.data.autoplay ? section.data.autoplay : null;
    this.autoplayHoverPause = this.autoplay ? section.data.autoplayHoverPause : false;
    this.autoplayDelay = this.autoplay ? section.data.autoplayDelay * 1000 : null;
    this._resizeFlickity = this._resizeFlickity.bind(this);

    this._setupSlideshow();
  }

  DynamicSlideshow_createClass(DynamicSlideshow, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.flickity) {
        this.slideshow.removeEventListener('rimg:load', this._resizeFlickity);
        this.flickity.destroy();
        this.flickity = null;
      }
    }
  }, {
    key: "onSectionBlockSelect",
    value: function onSectionBlockSelect(block) {
      if (!this.flickity) {
        return;
      }

      var slideIndex = parseInt(block.el.dataset.slideIndex, 10);
      this.flickity.select(slideIndex, true);

      if (this.autoplay) {
        this.flickity.stopPlayer();
      }
    }
  }, {
    key: "onSectionBlockDeselect",
    value: function onSectionBlockDeselect(block) {
      if (this.autoplay) {
        this.flickity.playPlayer();
      }
    }
  }, {
    key: "_setupSlideshow",
    value: function _setupSlideshow() {
      if (this.slideCount > 1) {
        this.flickity = new (js_default())(this.slideshow, {
          adaptiveHeight: true,
          autoPlay: this.autoplayDelay,
          cellSelector: '[data-slideshow-slide]',
          pageDots: true,
          pauseAutoPlayOnHover: this.autoplayHoverPause,
          prevNextButtons: true,
          resize: true,
          wrapAround: true,
          draggable: true
        });
        this.slideshow.addEventListener('rimg:load', this._resizeFlickity);
      }
    }
  }, {
    key: "_resizeFlickity",
    value: function _resizeFlickity() {
      if (this.flickity) {
        this.flickity.resize();
      }
    }
  }]);

  return DynamicSlideshow;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/DynamicTestimonials.js
function DynamicTestimonials_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DynamicTestimonials_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DynamicTestimonials_createClass(Constructor, protoProps, staticProps) { if (protoProps) DynamicTestimonials_defineProperties(Constructor.prototype, protoProps); if (staticProps) DynamicTestimonials_defineProperties(Constructor, staticProps); return Constructor; }




var DynamicTestimonials = /*#__PURE__*/function () {
  function DynamicTestimonials(section) {
    DynamicTestimonials_classCallCheck(this, DynamicTestimonials);

    this.el = section.el;
    this._flickity = this._flickity.bind(this);
    this.container = 'data-testimonials-container';
    this.slide = 'data-testimonial-item';
    this.testimonialsContainer = this.el.querySelector("[".concat(this.container, "]"));
    this.flickity = null;

    this._flickity();

    this._bindEvents();
  }

  DynamicTestimonials_createClass(DynamicTestimonials, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.remove();
    }
  }, {
    key: "remove",
    value: function remove() {
      window.removeEventListener('resize', scripts_themeUtils.debounce(this._flickity, 100));

      this._destroyFlickity();
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      window.addEventListener('resize', scripts_themeUtils.debounce(this._flickity, 100));
    }
  }, {
    key: "_flickity",
    value: function _flickity() {
      if (!this.testimonialsContainer) return; // If larger than 'small', destroy Flickity and exit

      if (!scripts_themeUtils.isSmall()) {
        this._destroyFlickity();
      } // If Flickity is initialised, exit


      if (this.flickity) {
        return;
      }

      this.flickity = new (js_default())(this.testimonialsContainer, {
        cellAlign: 'center',
        cellSelector: "[".concat(this.slide, "]"),
        contain: true,
        prevNextButtons: false,
        pageDots: false
      });
    }
  }, {
    key: "_destroyFlickity",
    value: function _destroyFlickity() {
      if (this.flickity) {
        this.flickity.destroy();
        this.flickity = null;
      }
    }
  }, {
    key: "onBlockSelect",
    value: function onBlockSelect(event) {
      if (!this.flickity) {
        return;
      }

      var index = parseInt(event.target.getAttribute(this.slide), 10) - 1;
      this.flickity.select(index, true);
    }
  }]);

  return DynamicTestimonials;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/DynamicVideoWithTextOverlay.js
function DynamicVideoWithTextOverlay_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function DynamicVideoWithTextOverlay_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function DynamicVideoWithTextOverlay_createClass(Constructor, protoProps, staticProps) { if (protoProps) DynamicVideoWithTextOverlay_defineProperties(Constructor.prototype, protoProps); if (staticProps) DynamicVideoWithTextOverlay_defineProperties(Constructor, staticProps); return Constructor; }

var DynamicVideoWithTextOverlay = /*#__PURE__*/function () {
  function DynamicVideoWithTextOverlay(section) {
    var _this = this;

    DynamicVideoWithTextOverlay_classCallCheck(this, DynamicVideoWithTextOverlay);

    this.el = section.el;
    this.el.querySelector('[data-play-video]').addEventListener('click', function () {
      return _this.playVideo();
    });
  }

  DynamicVideoWithTextOverlay_createClass(DynamicVideoWithTextOverlay, [{
    key: "playVideo",
    value: function playVideo() {
      var overlay = this.el.querySelector('[data-video-overlay]');
      var video = this.el.querySelector('iframe');

      if (!video) {
        return;
      } // Get src of video, and replace with auto-play url


      var videoSrc = video.getAttribute('src');
      var delimiter = (videoSrc != null ? videoSrc.indexOf('?') : undefined) === -1 ? '?' : '&';
      var videoSrcNew = "".concat(videoSrc).concat(delimiter, "autoplay=1");
      video.setAttribute('src', videoSrcNew);
      setTimeout(function () {
        return overlay.classList.add('overlay-inactive');
      }, 100);
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.remove();
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this2 = this;

      this.el.querySelector('[data-play-video]').removeEventListener('click', function () {
        return _this2.playVideo();
      });

      if (this.video) {
        this.video.remove();
      }
    }
  }]);

  return DynamicVideoWithTextOverlay;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/StaticArticle.js
function StaticArticle_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticArticle_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticArticle_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticArticle_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticArticle_defineProperties(Constructor, staticProps); return Constructor; }

var StaticArticle = /*#__PURE__*/function () {
  function StaticArticle(section) {
    StaticArticle_classCallCheck(this, StaticArticle);

    this.initializedClass = 'article-initialized';
    this.el = section.el;

    this._validate();
  }

  StaticArticle_createClass(StaticArticle, [{
    key: "update",
    value: function update() {
      this._validate();
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      var _this = this;

      window.removeEventListener('resize', function () {
        _this.setupFullWidthImages();

        if (window.innerWidth <= 1080) {
          _this.positionSidebar('below');
        } else {
          _this.positionSidebar();

          _this.setupFeaturedImage();
        }
      });
    }
  }, {
    key: "_validate",
    value: function _validate() {
      var _this2 = this;

      if (window.innerWidth <= 1080) {
        this.positionSidebar('below');
      } else {
        this.positionSidebar();
      }

      this.setupFeaturedImage();
      this.setupFullWidthImages();
      window.addEventListener('resize', function () {
        _this2.setupFullWidthImages();

        if (window.innerWidth <= 1080) {
          _this2.positionSidebar('below');
        } else {
          _this2.positionSidebar();

          _this2.setupFeaturedImage();
        }
      });
    }
  }, {
    key: "setupFeaturedImage",
    value: function setupFeaturedImage() {
      var posts = this.el.querySelectorAll('.blog-post');
      posts.forEach(function (post) {
        var image = post.querySelector('img.highlight');

        if (image) {
          image.addEventListener('rimg:load', function () {
            post.querySelector('.blog-post-inner').style.paddingTop = "".concat(image.getBoundingClientRect().height - 60, "px");
          });
        }
      });
    }
  }, {
    key: "setupFullWidthImages",
    value: function setupFullWidthImages() {
      var postContent = this.el.querySelector('.post-content');
      var postContentWidth = postContent.getBoundingClientRect().width;
      var postContentMargin = postContent.style.marginLeft;
      this.el.querySelectorAll('img.full-width').forEach(function (image) {
        image.style.width = "".concat(postContentWidth, "px");
        image.style.left = "-".concat(postContentMargin, "px");
      });
    }
  }, {
    key: "positionSidebar",
    value: function positionSidebar(position) {
      var wrapper = this.el.querySelector('.blog-post-wrapper');
      var sidebar = this.el.querySelector('.blog-sidebar');

      if (position === 'below') {
        wrapper.parentNode.insertBefore(sidebar, wrapper.nextSibling);
      } else {
        wrapper.parentNode.insertBefore(sidebar, wrapper);
      }
    }
  }]);

  return StaticArticle;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/StaticNavigation.js
function StaticNavigation_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticNavigation_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticNavigation_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticNavigation_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticNavigation_defineProperties(Constructor, staticProps); return Constructor; }




var StaticNavigation = /*#__PURE__*/function () {
  function StaticNavigation(section) {
    StaticNavigation_classCallCheck(this, StaticNavigation);

    this.el = section.el;
    this.events = new EventHandler/* default */.Z();
    this.navigationWrapper = this.el.querySelector('[data-navigation-wrapper]');
    this.navigationContent = this.el.querySelector('[data-navigation-content]');
    this.navigationWrapper.classList.add('navigation--loading');
    this.reloadNavigation();
    this.navigationWrapper.classList.remove('navigation--loading');
    this.navigationWrapper.classList.add('navigation--loaded');
  }

  StaticNavigation_createClass(StaticNavigation, [{
    key: "reloadNavigation",
    value: function reloadNavigation() {
      var _this = this;

      this.events.unregisterAll();

      if (!scripts_themeUtils.isLessThanLarge()) {
        var headerBranding = document.querySelector('[data-header-branding]');
        headerBranding.parentNode.insertBefore(this.navigationWrapper, headerBranding.nextSibling);
        this.navigationContent.classList.remove('navigation-mobile');
        this.navigationContent.classList.add('navigation-desktop');
        var megaNav = this.navigationContent.querySelector('li[data-mega-nav="true"]');

        if (megaNav) {
          megaNav.classList.remove('has-dropdown');
          megaNav.classList.add('has-mega-nav');
        }
      } else {
        var headerMain = document.querySelector('[data-header-main]');
        headerMain.parentNode.insertBefore(this.navigationWrapper, headerMain.nextSibling);
        this.navigationContent.classList.add('navigation-mobile');
        this.navigationContent.classList.remove('navigation-desktop');

        var _megaNav = this.navigationContent.querySelector('li[data-mega-nav="true"]');

        if (_megaNav) {
          _megaNav.classList.add('has-dropdown');

          _megaNav.classList.remove('has-mega-nav');
        }
      }

      this.el.querySelectorAll('.mega-nav-list li a').forEach(function (anchor) {
        return _this.events.register(anchor, 'mouseover', _this._onMegaNavAnchorMouseover.bind(_this));
      });
      this.el.querySelectorAll('.mega-nav-list a').forEach(function (anchor) {
        return _this.events.register(anchor, 'mouseover', _this._onMegaNavAnchorMouseleave.bind(_this));
      });
      this.el.querySelectorAll('[data-header-nav-toggle]').forEach(function (toggle) {
        return _this.events.register(toggle, 'click', _this._onMobileNavigationClick.bind(_this));
      });
      this.events.register(window, 'resize', scripts_themeUtils.debounce(this._onResize.bind(this), 500));
      var currentCloseAction = {
        el: null,
        timeout: null
      };
      this.el.querySelectorAll('.has-dropdown, .has-mega-nav').forEach(function (toggle) {
        return _this.events.register(toggle, 'mouseenter', function (event) {
          if (scripts_themeUtils.isLessThanLarge()) return;
          var currentTarget = event.currentTarget;

          if (currentCloseAction.el && currentCloseAction.timeout) {
            clearTimeout(currentCloseAction.timeout);

            _this._closeDropdown(currentCloseAction.el);

            currentCloseAction.el = null;
            currentCloseAction.timeout = null;
          }

          if (currentTarget.classList.contains('has-mega-nav')) {
            _this._swapMegaNavImages(currentTarget.querySelector('.mega-nav-image img'));
          }

          _this._openDropdown(currentTarget);
        });
      });
      this.el.querySelectorAll('.has-dropdown, .has-mega-nav').forEach(function (toggle) {
        return _this.events.register(toggle, 'mouseleave', function (event) {
          if (scripts_themeUtils.isLessThanLarge()) return;
          var currentTarget = event.currentTarget;

          if (currentCloseAction.el && currentCloseAction.timeout) {
            // Don't add another action for an element that is nested within a currently closing dropdown
            if (currentCloseAction.el.contains(currentTarget)) return;
            clearTimeout(currentCloseAction.timeout); // Close the current dropdown if one exists and hasn't been run, but only if it isn't a child of this new event

            if (!currentTarget.contains(currentCloseAction.el)) {
              _this._closeDropdown(currentCloseAction.el);
            }
          }

          currentCloseAction.el = currentTarget;
          currentCloseAction.timeout = setTimeout(function () {
            _this._closeDropdown(currentCloseAction.el);

            currentCloseAction.el = null;
            currentCloseAction.timeout = null;
          }, 400);
        });
      });
      this.el.querySelectorAll('.has-dropdown > a > [data-subnav-toggle]').forEach(function (toggle) {
        return _this.events.register(toggle, 'click', function (event) {
          event.stopPropagation();
          event.preventDefault();
          var currentTarget = event.currentTarget;
          var triggerEl = currentTarget.parentElement.parentElement;

          if (triggerEl.classList.contains('has-dropdown--active')) {
            _this._closeDropdown(triggerEl);
          } else {
            _this._openDropdown(triggerEl);
          }
        });
      });
      this.el.querySelectorAll('.navigation-submenu').forEach(function (toggle) {
        return _this.events.register(toggle, 'revealer-animating', function (event) {
          if (scripts_themeUtils.isLessThanLarge()) {
            return;
          }

          var dropdown = event.currentTarget;

          if (!dropdown.classList.contains('animating-in')) {
            return;
          }

          dropdown.classList.remove('navigation-submenu-open-left');
          dropdown.style.opacity = 0;
          dropdown.style.display = 'block';

          var navigationWidth = _this.navigationWrapper.getBoundingClientRect().width;

          var offset = dropdown.getBoundingClientRect().left + window.pageXOffset;

          if (offset + 200 > navigationWidth) {
            dropdown.classList.add('navigation-submenu-open-left');
          }

          dropdown.style.opacity = '';
          dropdown.style.display = '';
        });
      });
    }
  }, {
    key: "onSectionDeselect",
    value: function onSectionDeselect() {
      this._toggleMobileNavigation('close');
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.events.unregisterAll();

      this._toggleMobileNavigation('close');
    }
  }, {
    key: "_onResize",
    value: function _onResize() {
      if (!scripts_themeUtils.isLessThanLarge()) {
        this._toggleMobileNavigation('close');
      }

      this.reloadNavigation();
    }
  }, {
    key: "_onMegaNavAnchorMouseover",
    value: function _onMegaNavAnchorMouseover(e) {
      this._swapMegaNavImages(e.currentTarget.parentNode);
    }
  }, {
    key: "_onMegaNavAnchorMouseleave",
    value: function _onMegaNavAnchorMouseleave(e) {
      var megaNavImage = e.target.closest('.mega-nav').querySelector('.mega-nav-image img');
      if (!megaNavImage) return;
      megaNavImage.setAttribute('src', megaNavImage.dataset.image);
      megaNavImage.setAttribute('alt', megaNavImage.dataset.alt);
    }
  }, {
    key: "_onMobileNavigationClick",
    value: function _onMobileNavigationClick() {
      this._toggleMobileNavigation();
    }
  }, {
    key: "_openDropdown",
    value: function _openDropdown(triggerEl) {
      triggerEl.classList.add('has-dropdown--active');
      var navigationSubmenuToggle = triggerEl.querySelector('.navigation-submenu-toggle');

      if (scripts_themeUtils.isLessThanLarge()) {
        var dropdown = triggerEl.querySelector('.navigation-submenu');
        triggerEl.classList.add('has-mobile-dropdown--active');
        dropdown.classList.add('navigation-submenu-visible');

        this._setTierHeight();
      } else {
        var megaNav = triggerEl.querySelector('.mega-nav');

        var _dropdown = triggerEl.querySelector('.navigation-submenu');

        if (megaNav) {
          megaNav.classList.add('visible');
        } else {
          _dropdown.classList.add('navigation-submenu-visible');

          _dropdown.classList.add('visible');
        }
      }

      navigationSubmenuToggle.setAttribute('aria-expanded', true);
    }
  }, {
    key: "_closeDropdown",
    value: function _closeDropdown(triggerEl) {
      var _this2 = this;

      triggerEl.classList.remove('has-dropdown--active');
      triggerEl.querySelectorAll('.has-dropdown, .has-mega-nav').forEach(function (innerTriggerEl) {
        return _this2._closeDropdown(innerTriggerEl);
      });
      var dropdown = triggerEl.querySelector('.navigation-submenu');
      var megaNav = triggerEl.querySelector('.mega-nav');
      var navigationSubmenuToggle = triggerEl.querySelector('.navigation-submenu-toggle');

      if (dropdown) {
        dropdown.classList.remove('navigation-submenu-visible');
        dropdown.classList.remove('visible');
      }

      triggerEl.classList.remove('has-mobile-dropdown--active');

      if (megaNav) {
        megaNav.classList.remove('visible');
      }

      this._setTierHeight();

      if (navigationSubmenuToggle) {
        navigationSubmenuToggle.setAttribute('aria-expanded', false);
      }
    }
  }, {
    key: "_toggleMobileNavigation",
    value: function _toggleMobileNavigation() {
      var _this3 = this;

      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (document.body.classList.contains('mobile-nav-open') && force !== 'open') {
        this.navigationContent.removeAttribute('style');
        document.body.classList.remove('mobile-nav-open');
        document.body.classList.remove('lock-scroll');
        this.navigationContent.classList.remove('visible');
        this.navigationWrapper.classList.remove('visible');
        this.navigationWrapper.classList.remove('background'); // Close opened menus on navigation close

        this.navigationContent.querySelectorAll('.has-dropdown--active').forEach(function (triggerEl) {
          return _this3._closeDropdown(triggerEl);
        });
      } else if (!document.body.classList.contains('mobile-nav-open') && force !== 'close') {
        document.body.classList.add('mobile-nav-open');
        document.body.classList.add('lock-scroll');
        this.navigationWrapper.classList.add('visible');
        this.navigationWrapper.classList.add('background');
        this.navigationContent.classList.add('visible');

        this._setTierHeight();
      }
    }
  }, {
    key: "_setTierHeight",
    value: function _setTierHeight() {
      this.navigationContent.style.overflowY = scroll;
      this.navigationContent.style.height = '100%';
    }
  }, {
    key: "_swapMegaNavImages",
    value: function _swapMegaNavImages(target) {
      if (!target) return;
      var _target$dataset = target.dataset,
          image = _target$dataset.image,
          imageAlt = _target$dataset.imageAlt;

      if (image && image !== '') {
        var megaNavImg = target.closest('.mega-nav').querySelector('.mega-nav-image img');
        if (!megaNavImg) return;
        megaNavImg.setAttribute('src', image);
        megaNavImg.setAttribute('srcset', '');
        megaNavImg.setAttribute('alt', imageAlt);
      }
    }
  }]);

  return StaticNavigation;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/StaticHeader.js
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function StaticHeader_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticHeader_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticHeader_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticHeader_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticHeader_defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var StaticHeader = /*#__PURE__*/function (_StaticNavigation) {
  _inherits(StaticHeader, _StaticNavigation);

  var _super = _createSuper(StaticHeader);

  function StaticHeader(section) {
    var _this;

    StaticHeader_classCallCheck(this, StaticHeader);

    _this = _super.call(this, section);
    _this.el = section.el;
    _this.mainHeader = _this.el.querySelector('[data-header-main]');
    _this.headerContent = _this.el.querySelector('[data-header-content]');
    _this.navigationWrapper = _this.el.querySelector('[data-navigation-wrapper]');
    _this.navigationContent = _this.el.querySelector('[data-navigation-content]');
    _this.branding = _this.el.querySelector('[data-header-branding]');
    _this.headerTools = _this.el.querySelector('.header-tools');
    _this.headerRight = _this.el.querySelector('[data-header-content-right]');
    _this.headerSearch = _this.el.querySelector('[data-header-search]');
    _this.headerSearchSubmit = _this.el.querySelector('[data-header-search-button]');
    _this.headerSearchClose = _this.el.querySelector('[data-header-search-button-close]');
    _this.cachedHeight = 0;
    _this.cachedStickyHeight = 0;
    _this.isCacheStale = true;
    _this.isStickyHeader = section.data.stickyHeader;
    _this.isCompactCenter = section.data.compactCenter === 'compact-center';
    _this.navHeight = 0;
    _this.windowWidth = scripts_themeUtils.windowWidth();
    setTimeout(function () {
      _this.navHeight = _this.navigationWrapper.getBoundingClientRect().height;
    }, 100);

    _this._setSearchWidth();

    _this._setupBranding();

    _this._setCompactCenterHeights();

    _this._toggleStickyHeader(_this._shouldHeaderStick());

    _this._bindEvents();

    _this.reloadNavigation();

    return _this;
  }

  StaticHeader_createClass(StaticHeader, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      _get(_getPrototypeOf(StaticHeader.prototype), "onSectionUnload", this).call(this);

      window.removeEventListener('resize', this.resizeHeader);
      window.removeEventListener('scroll', this.scrollHeader);
      this.headerSearchSubmit.removeEventListener('click', this.clickHeaderSearchSubmit);
      this.headerSearchClose.removeEventListener('click', this.clickHeaderSearchClose);

      this._toggleStickyHeader(this._shouldHeaderStick());
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this2 = this;

      this.resizeHeader = function () {
        // Prevent resize caused by iOS viewport change
        if (scripts_themeUtils.windowWidth() === _this2.windowWidth) {
          return;
        }

        _this2.windowWidth = scripts_themeUtils.windowWidth();
        _this2.navHeight = _this2.navigationWrapper.getBoundingClientRect().height;
        _this2.isCacheStale = true;

        _this2._toggleStickyHeader(_this2._shouldHeaderStick());

        _this2._setSearchWidth();

        _this2._setCompactCenterHeights();

        if (!scripts_themeUtils.isLessThanLarge()) {
          _this2._toggleSearchForm(false);
        }
      };

      this.scrollHeader = function () {
        // Only calculate heights on scroll if sticky header is disabled
        if (!_this2.isStickyHeader) {
          _this2._setCompactCenterHeights();
        } // Sticky header calculates heights


        _this2._toggleStickyHeader(_this2._shouldHeaderStick());
      };

      window.addEventListener('resize', this.resizeHeader);
      window.addEventListener('scroll', this.scrollHeader);

      this.clickHeaderSearchSubmit = function (event) {
        var currentTarget = event.currentTarget;

        if (!scripts_themeUtils.isLessThanLarge()) {
          return;
        }

        if (currentTarget.dataset.clicked) {
          return;
        }

        event.preventDefault();
        currentTarget.dataset.clicked = true;

        _this2._bindCloseSearch();

        _this2._toggleSearchForm(true);
      };

      this.clickHeaderSearchClose = function (event) {
        event.preventDefault();

        _this2._toggleSearchForm(false);
      };

      this.headerSearchSubmit.addEventListener('click', this.clickHeaderSearchSubmit);
      this.headerSearchClose.addEventListener('click', this.clickHeaderSearchClose);
    }
    /*
          When search form is open, and receives click outside of form, close
          */

  }, {
    key: "_bindCloseSearch",
    value: function _bindCloseSearch() {
      var _this3 = this;

      this.clickHeaderSearchClose = function (event) {
        var target = event.target;
        var nodes = [];
        var element = target;
        nodes.push(element);

        while (element.parentElement) {
          if (element.parentElement.classList.contains('[data-header-search]')) {
            nodes.unshift(element.parentElement);
          }

          element = element.parentElement;
        }

        if (nodes.length) {
          return;
        }

        _this3._toggleSearchForm(false);
      };

      document.body.addEventListener('click', this.clickHeaderSearchClose);
    }
  }, {
    key: "_shouldHeaderStick",
    value: function _shouldHeaderStick() {
      var shouldStick = false;

      if (!this.isStickyHeader) {
        return shouldStick;
      }

      if (this.isCacheStale) {
        var height = document.body.classList.contains('sticky-header') ? 0 : this.headerContent.getBoundingClientRect().height;
        var stickyHeight = document.body.classList.contains('sticky-header') ? this.headerContent.getBoundingClientRect().height : 0;
        document.body.classList.toggle('sticky-header');
        height = !document.body.classList.contains('sticky-header') ? this.headerContent.getBoundingClientRect().height : height;
        stickyHeight = !document.body.classList.contains('sticky-header') ? stickyHeight : this.headerContent.getBoundingClientRect().height;
        document.body.classList.toggle('sticky-header');
        this.cachedHeight = height;
        this.cachedStickyHeight = stickyHeight;
        this.isCacheStale = false;
      }

      if (window.scrollY > this.headerTools.getBoundingClientRect().height + this.cachedHeight - this.cachedStickyHeight) {
        shouldStick = true;
      }

      if (scripts_themeUtils.isLessThanLarge() || document.body.classList.contains('alternate-index-layout')) {
        shouldStick = false;
      }

      return shouldStick;
    }
  }, {
    key: "_toggleStickyHeader",
    value: function _toggleStickyHeader(toggleOn) {
      var paddingBottom;

      if (toggleOn == null) {
        toggleOn = false;
      }

      if (toggleOn && !document.body.classList.contains('sticky-header')) {
        paddingBottom = this.cachedHeight;
        this.mainHeader.style.paddingBottom = "".concat(paddingBottom, "px");
      }

      if (!toggleOn) {
        paddingBottom = 0;
        this.mainHeader.style.paddingBottom = "".concat(paddingBottom, "px");
      }

      if (toggleOn !== document.body.classList.contains('sticky-header')) {
        if (toggleOn) {
          document.body.classList.add('sticky-header');
        } else {
          document.body.classList.remove('sticky-header');
        }

        this._setCompactCenterHeights(!toggleOn);
      }
    }
    /*
          Expand search form logic
          */

  }, {
    key: "_toggleSearchForm",
    value: function _toggleSearchForm(open) {
      var _this4 = this;

      if (open == null) {
        open = false;
      }

      var headerRightWidth = '';
      var headerSearchWidth = isNaN(this.headerSearch.dataset.width) ? this.headerSearch.data.width : parseInt(this.headerSearch.dataset.width, 10);
      var searchButtonWidth = this.headerSearchClose.getBoundingClientRect().width;
      var logoCollision = false;
      var navCollision = false;

      if (open) {
        var _this$_logoSearchColl = this._logoSearchCollision(headerSearchWidth);

        logoCollision = _this$_logoSearchColl.logoCollision;
        navCollision = _this$_logoSearchColl.navCollision;
        headerRightWidth = headerSearchWidth + searchButtonWidth;
        headerSearchWidth = '100%';
      } else {
        this.headerSearchSubmit.dataset.clicked = false;
        document.body.removeEventListener('click', this.clickHeaderSearchClose);
      }

      if (!open && this.mainHeader.classList.contains('header-search-expanded')) {
        this.mainHeader.classList.add('header-search-expanded-closing');
      }

      if (open) {
        this.mainHeader.classList.add('header-search-expanded');
      } else {
        this.mainHeader.classList.remove('header-search-expanded');
      }

      if (navCollision) {
        this.mainHeader.classList.add('header-nav-toggle-covered');
      } else {
        this.mainHeader.classList.remove('header-nav-toggle-covered');
      }

      this.mainHeader.addEventListener('transitionend', function () {
        if (!open) {
          _this4.mainHeader.classList.remove('header-search-expanded-closing');
        }
      });

      if (logoCollision) {
        this.mainHeader.classList.add('header-logo-covered');
      } else {
        this.mainHeader.classList.remove('header-logo-covered');
      }

      this.headerRight.style.width = isNaN(headerRightWidth) ? headerRightWidth : "".concat(headerRightWidth, "px");
      this.headerSearch.style.width = isNaN(headerSearchWidth) ? headerSearchWidth : "".concat(headerSearchWidth, "px");
    }
    /*
          Detect if Logo or nav toggle will be covered by expanded search form
          */

  }, {
    key: "_logoSearchCollision",
    value: function _logoSearchCollision(headerSearchWidth) {
      var logoRightEdge = document.querySelector('[data-header-branding] .logo-link').getBoundingClientRect().right;
      var navRightEdge = document.querySelector('[data-header-content] [data-header-nav-toggle]').getBoundingClientRect().right;
      var searchLeftEdge = document.querySelector('[data-header-search]').getBoundingClientRect().left - headerSearchWidth;
      var logoCollision = logoRightEdge > searchLeftEdge;
      var navCollision = navRightEdge > searchLeftEdge;
      return {
        logoCollision: logoCollision,
        navCollision: navCollision
      };
    }
    /*
          Match Navigation and Branding heights
          Center navigation vertically if Branding is taller
          */

  }, {
    key: "_setCompactCenterHeights",
    value: function _setCompactCenterHeights(toggleOn) {
      if (toggleOn == null) {
        toggleOn = true;
      }

      if (!this.isCompactCenter) {
        return;
      }

      var minHeight = 'auto'; // Get height of inner navigation to prevent height locking on two row navigation

      var navHeight = this.navigationContent.getBoundingClientRect().height;
      var navOffset = 0;

      if (!scripts_themeUtils.isLessThanLarge() && toggleOn) {
        var heights = [];
        heights.push(navHeight);
        heights.push(this.branding.getBoundingClientRect().height);
        minHeight = Math.max.apply(null, heights);
      }

      if (navHeight < minHeight) {
        navOffset = (minHeight - navHeight) / 2;
      }

      this.navHeight = this.navigationWrapper.getBoundingClientRect().height;
      this.navigationWrapper.style.marginTop = "".concat(navOffset, "px");
      this.headerContent.style.minHeight = "".concat(minHeight, "px");
    }
  }, {
    key: "_setupBranding",
    value: function _setupBranding() {
      // Clone desktop branding to mobile
      var mobileBranding = this.branding.cloneNode(true);
      mobileBranding.removeAttribute('data-header-branding');
      mobileBranding.classList.remove('header-branding-desktop');
      mobileBranding.classList.add('header-branding-mobile');
      this.navigationContent.insertBefore(mobileBranding, this.navigationContent.firstChild);
    }
  }, {
    key: "_setSearchWidth",
    value: function _setSearchWidth() {
      var miniCartWrapper = this.mainHeader.querySelector('.mini-cart-wrapper');
      var checkoutLink = this.mainHeader.querySelector('.checkout-link');
      checkoutLink.style.display = 'inline-block';
      var searchWidth = miniCartWrapper.getBoundingClientRect().width + checkoutLink.getBoundingClientRect().width;
      checkoutLink.style.display = '';
      this.headerSearch.style.width = "".concat(searchWidth, "px");
      this.headerSearch.dataset.width = searchWidth;
    }
  }]);

  return StaticHeader;
}(StaticNavigation);


;// CONCATENATED MODULE: ./node_modules/@pixelunion/shopify-cross-border/dist/index.es.js
function shopify_cross_border_dist_index_es_classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function shopify_cross_border_dist_index_es_defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function shopify_cross_border_dist_index_es_createClass(Constructor, protoProps, staticProps) {
  if (protoProps) shopify_cross_border_dist_index_es_defineProperties(Constructor.prototype, protoProps);
  if (staticProps) shopify_cross_border_dist_index_es_defineProperties(Constructor, staticProps);
  return Constructor;
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

var EventHandler_1 = createCommonjsModule(function (module, exports) {

exports.__esModule = true;

var EventHandler =
/** @class */
function () {
  function EventHandler() {
    this.events = [];
  }

  EventHandler.prototype.register = function (el, event, listener) {
    if (!el || !event || !listener) return null;
    this.events.push({
      el: el,
      event: event,
      listener: listener
    });
    el.addEventListener(event, listener);
    return {
      el: el,
      event: event,
      listener: listener
    };
  };

  EventHandler.prototype.unregister = function (_a) {
    var el = _a.el,
        event = _a.event,
        listener = _a.listener;
    if (!el || !event || !listener) return null;
    this.events = this.events.filter(function (e) {
      return el !== e.el || event !== e.event || listener !== e.listener;
    });
    el.removeEventListener(event, listener);
    return {
      el: el,
      event: event,
      listener: listener
    };
  };

  EventHandler.prototype.unregisterAll = function () {
    this.events.forEach(function (_a) {
      var el = _a.el,
          event = _a.event,
          listener = _a.listener;
      return el.removeEventListener(event, listener);
    });
    this.events = [];
  };

  return EventHandler;
}();

exports["default"] = EventHandler;
});

var Events = /*@__PURE__*/getDefaultExportFromCjs(EventHandler_1);

var selectors = {
  disclosureList: '[data-disclosure-list]',
  disclosureToggle: '[data-disclosure-toggle]',
  disclosureInput: '[data-disclosure-input]',
  disclosureOptions: '[data-disclosure-option]'
};
var classes = {
  listVisible: 'disclosure-list--visible',
  alternateDrop: 'disclosure-list--alternate-drop'
};

var Disclosure = /*#__PURE__*/function () {
  function Disclosure(el) {
    shopify_cross_border_dist_index_es_classCallCheck(this, Disclosure);

    this.el = el;
    this.events = new Events();
    this.cache = {};

    this._cacheSelectors();

    this._connectOptions();

    this._connectToggle();

    this._onFocusOut();
  }

  shopify_cross_border_dist_index_es_createClass(Disclosure, [{
    key: "_cacheSelectors",
    value: function _cacheSelectors() {
      this.cache = {
        disclosureList: this.el.querySelector(selectors.disclosureList),
        disclosureToggle: this.el.querySelector(selectors.disclosureToggle),
        disclosureInput: this.el.querySelector(selectors.disclosureInput),
        disclosureOptions: this.el.querySelectorAll(selectors.disclosureOptions)
      };
    }
  }, {
    key: "_connectToggle",
    value: function _connectToggle() {
      var _this = this;

      this.events.register(this.cache.disclosureToggle, 'click', function (e) {
        var ariaExpanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
        e.currentTarget.setAttribute('aria-expanded', !ariaExpanded);

        _this.cache.disclosureList.classList.remove(classes.alternateDrop);

        _this.cache.disclosureList.classList.toggle(classes.listVisible);

        window.requestAnimationFrame(function () {
          var _this$cache$disclosur = _this.cache.disclosureList.getBoundingClientRect(),
              left = _this$cache$disclosur.left,
              width = _this$cache$disclosur.width;

          var _window = window,
              innerWidth = _window.innerWidth;
          var gutter = 30;

          if (left + width + gutter > innerWidth) {
            _this.cache.disclosureList.classList.add(classes.alternateDrop);
          }
        });
      });
    }
  }, {
    key: "_connectOptions",
    value: function _connectOptions() {
      var _this2 = this;

      var options = this.cache.disclosureOptions;

      for (var i = 0; i < options.length; i++) {
        var option = options[i];
        this.events.register(option, 'click', function (e) {
          return _this2._submitForm(e.currentTarget.dataset.value);
        });
      }
    }
  }, {
    key: "_onFocusOut",
    value: function _onFocusOut() {
      var _this3 = this;

      this.events.register(this.cache.disclosureToggle, 'focusout', function (e) {
        var disclosureLostFocus = !_this3.el.contains(e.relatedTarget);

        if (disclosureLostFocus) {
          _this3._hideList();
        }
      });
      this.events.register(this.cache.disclosureList, 'focusout', function (e) {
        var childInFocus = e.currentTarget.contains(e.relatedTarget);

        var isVisible = _this3.cache.disclosureList.classList.contains(classes.listVisible);

        if (isVisible && !childInFocus) {
          _this3._hideList();
        }
      });
      this.events.register(this.el, 'keyup', function (e) {
        if (e.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }

        if (e.key !== 'Escape' || e.key !== 'Esc') return;

        _this3._hideList();

        _this3.cache.disclosureToggle.focus();
      });
      this.events.register(document.body, 'click', function (e) {
        var isOption = _this3.el.contains(e.target);

        var isVisible = _this3.cache.disclosureList.classList.contains(classes.listVisible);

        if (isVisible && !isOption) {
          _this3._hideList();
        }
      });
    }
  }, {
    key: "_submitForm",
    value: function _submitForm(value) {
      this.cache.disclosureInput.value = value;
      this.el.closest('form').submit();
    }
  }, {
    key: "_hideList",
    value: function _hideList() {
      this.cache.disclosureList.classList.remove(classes.listVisible);
      this.cache.disclosureToggle.setAttribute('aria-expanded', false);
    }
  }, {
    key: "unload",
    value: function unload() {
      this.events.unregisterAll();
    }
  }]);

  return Disclosure;
}();

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function closest(s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}

/* harmony default export */ var shopify_cross_border_dist_index_es = (Disclosure);

;// CONCATENATED MODULE: ./source/scripts/sections/StaticFooter.js
function StaticFooter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticFooter_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticFooter_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticFooter_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticFooter_defineProperties(Constructor, staticProps); return Constructor; }




var StaticFooter = /*#__PURE__*/function () {
  function StaticFooter(section) {
    var _this = this;

    StaticFooter_classCallCheck(this, StaticFooter);

    this.el = section.el;
    this.mailingListEl = this.el.querySelector('.mailing-list');
    this.upperFooterEl = this.el.querySelector('.upper-footer');
    this.events = new EventHandler/* default */.Z();
    var currencyDisclosureEl = section.el.querySelector('[data-disclosure-currency]');
    var localeDisclosureEl = section.el.querySelector('[data-disclosure-locale]');

    if (currencyDisclosureEl) {
      this.currencyDisclosure = new shopify_cross_border_dist_index_es(currencyDisclosureEl);
    }

    if (localeDisclosureEl) {
      this.localeDisclosure = new shopify_cross_border_dist_index_es(localeDisclosureEl);
    }

    this.events.register(window, 'resize', function () {
      if (!_this.mailingListEl) return;

      if (window.innerWidth <= 1080 && window.innerWidth !== _this.width) {
        _this.upperFooterEl.insertBefore(_this.mailingListEl, _this.upperFooterEl.firstChild);
      } else if (window.innerWidth !== _this.width) {
        _this.upperFooterEl.appendChild(_this.mailingListEl);
      }
    });
  }

  StaticFooter_createClass(StaticFooter, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.events.unregisterAll();

      if (this.currencyDisclosure) {
        this.currencyDisclosure.unload();
      }

      if (this.localeDisclosure) {
        this.localeDisclosure.unload();
      }
    }
  }]);

  return StaticFooter;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/StaticCollection.js
function StaticCollection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticCollection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticCollection_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticCollection_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticCollection_defineProperties(Constructor, staticProps); return Constructor; }





var StaticCollection = /*#__PURE__*/function () {
  function StaticCollection(section) {
    var _this = this;

    StaticCollection_classCallCheck(this, StaticCollection);

    this.el = section.el;
    this.collectionTagsEl = this.el.querySelector('[data-collection-tags]');
    this.collectionSortingEl = this.el.querySelector('[data-collection-sorting]');
    this.masonry = this.el.querySelector('[data-masonry-grid]');
    this.masonryGrid = null;
    this.productListItems = [];
    document.querySelectorAll('.product-list-item').forEach(function (product) {
      return _this.productListItems.push(new ProductListItem({
        el: product
      }));
    });

    if (this.collectionTagsEl) {
      this.collectionTagsEl.addEventListener('change', function (event) {
        return _this.filterCollection(event);
      });
      new Select({
        el: this.collectionTagsEl
      });
    }

    if (this.collectionSortingEl) {
      this.collectionSortingEl.addEventListener('change', function (event) {
        return _this.sortCollection(event);
      });
      new Select({
        el: this.collectionSortingEl
      });
    }

    if (this.masonry) {
      this.masonryGrid = new MasonryGrid({
        el: this.masonry,
        settings: {
          itemSelector: '.product-list-item',
          horizontalOrder: true
        }
      });
    }
  }

  StaticCollection_createClass(StaticCollection, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.remove();
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this2 = this;

      if (this.masonryGrid) {
        this.masonryGrid.unload();
      }

      for (var i = 0; i < this.productListItems.length; i++) {
        this.productListItems[i].remove();
      }

      this.collectionTagsEl.removeEventListener('change', function (event) {
        return _this2.filterCollection(event);
      });
      this.collectionSortingEl.removeEventListener('change', function (event) {
        return _this2.sortCollection(event);
      });
    }
  }, {
    key: "filterCollection",
    value: function filterCollection(event) {
      var currentTarget = event.currentTarget;
      var tag = currentTarget.value,
          dataset = currentTarget.dataset;
      var url = dataset.url;

      if (tag === 'all') {
        window.location.href = "".concat(window.Theme.routes.collections_url, "/").concat(url);
      } else {
        window.location.href = "".concat(window.Theme.routes.collections_url, "/").concat(url, "/").concat(tag);
      }
    }
  }, {
    key: "sortCollection",
    value: function sortCollection(event) {
      var currentTarget = event.currentTarget;
      var search;
      var Sorting = {};
      Sorting.sort_by = currentTarget.value;

      if (currentTarget.closest('.select-wrapper').classList.contains('vendor-collection')) {
        var currentSearch = location.search;
        var searchParts = currentSearch.split('&');

        for (var index = 0; index < searchParts.length; index++) {
          var part = searchParts[index];

          if (part.indexOf('sort_by') !== -1) {
            searchParts.splice(index, 1);
          }
        }

        search = searchParts.join('&');
        location.search = "".concat(search, "&").concat(Object.keys(Sorting).map(function (k) {
          return "".concat(encodeURIComponent(k), "=").concat(encodeURIComponent(Sorting[k]));
        }).join('&'));
        return;
      }

      location.search = Object.keys(Sorting).map(function (k) {
        return "".concat(encodeURIComponent(k), "=").concat(encodeURIComponent(Sorting[k]));
      }).join('&');
    }
  }]);

  return StaticCollection;
}();


;// CONCATENATED MODULE: ./node_modules/@shopify/theme-addresses/theme-addresses.js
/**
 * CountryProvinceSelector Constructor
 * @param {String} countryOptions the country options in html string
 */
function CountryProvinceSelector(countryOptions) {
  if (typeof countryOptions !== 'string') {
    throw new TypeError(countryOptions + ' is not a string.');
  }
  this.countryOptions = countryOptions;
}

/**
 * Builds the country and province selector with the given node element
 * @param {Node} countryNodeElement The <select> element for country
 * @param {Node} provinceNodeElement The <select> element for province
 * @param {Object} options Additional settings available
 * @param {CountryProvinceSelector~onCountryChange} options.onCountryChange callback after a country `change` event
 * @param {CountryProvinceSelector~onProvinceChange} options.onProvinceChange callback after a province `change` event
 */
CountryProvinceSelector.prototype.build = function (countryNodeElement, provinceNodeElement, options) {
  if (typeof countryNodeElement !== 'object') {
    throw new TypeError(countryNodeElement + ' is not a object.');
  }

  if (typeof provinceNodeElement !== 'object') {
    throw new TypeError(provinceNodeElement + ' is not a object.');
  }

  var defaultValue = countryNodeElement.getAttribute('data-default');
  options = options || {}

  countryNodeElement.innerHTML = this.countryOptions;
  countryNodeElement.value = defaultValue;

  if (defaultValue && getOption(countryNodeElement, defaultValue)) {
    var provinces = buildProvince(countryNodeElement, provinceNodeElement, defaultValue);
    options.onCountryChange && options.onCountryChange(provinces, provinceNodeElement, countryNodeElement);
  }

  // Listen for value change on the country select
  countryNodeElement.addEventListener('change', function (event) {
    var target = event.target;
    var selectedValue = target.value;
    
    var provinces = buildProvince(target, provinceNodeElement, selectedValue);
    options.onCountryChange && options.onCountryChange(provinces, provinceNodeElement, countryNodeElement);
  });

  options.onProvinceChange && provinceNodeElement.addEventListener('change', options.onProvinceChange);
}

/**
 * This callback is called after a user interacted with a country `<select>`
 * @callback CountryProvinceSelector~onCountryChange
 * @param {array} provinces the parsed provinces
 * @param {Node} provinceNodeElement province `<select>` element
 * @param {Node} countryNodeElement country `<select>` element
 */

 /**
 * This callback is called after a user interacted with a province `<select>`
 * @callback CountryProvinceSelector~onProvinceChange
 * @param {Event} event the province selector `change` event object
 */

/**
 * Returns the <option> with the specified value from the
 * given node element
 * A null is returned if no such <option> is found
 */
function getOption(nodeElement, value) {
  return nodeElement.querySelector('option[value="' + value +'"]')
}

/**
 * Builds the options for province selector
 */
function buildOptions (provinceNodeElement, provinces) {
  var defaultValue = provinceNodeElement.getAttribute('data-default');

  provinces.forEach(function (option) {
    var optionElement = document.createElement('option');
    optionElement.value = option[0];
    optionElement.textContent = option[1];

    provinceNodeElement.appendChild(optionElement);
  })

  if (defaultValue && getOption(provinceNodeElement, defaultValue)) {
    provinceNodeElement.value = defaultValue;
  }
}

/**
 * Builds the province selector
 */
function buildProvince (countryNodeElement, provinceNodeElement, selectedValue) {
  var selectedOption = getOption(countryNodeElement, selectedValue);
  var provinces = JSON.parse(selectedOption.getAttribute('data-provinces'));

  provinceNodeElement.options.length = 0;

  if (provinces.length) {
    buildOptions(provinceNodeElement, provinces)
  }

  return provinces;
}

;// CONCATENATED MODULE: ./source/scripts/sections/StaticCart.js
function StaticCart_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticCart_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticCart_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticCart_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticCart_defineProperties(Constructor, staticProps); return Constructor; }






var StaticCart = /*#__PURE__*/function () {
  function StaticCart(section) {
    var _this = this;

    StaticCart_classCallCheck(this, StaticCart);

    this.el = section.el;
    this.cartTable = this.el.querySelector('[data-cart-table]');
    this.cartDiscountContainer = this.el.querySelector('[data-cart-discount-container]');
    this.totalPrice = this.el.querySelector('[data-total-price]');
    this.quantityInputs = null;
    this.removeItem = null;
    this.updateTimeout = null;
    this.initializedClass = 'cart-initialized';
    this.cartInstructionsTextarea = document.querySelector('.cart-instructions textarea');

    if (this.cartInstructionsTextarea) {
      this.cartInstructionsTextarea.addEventListener('change', function () {
        return _this.saveSpecialInstructions();
      });
    }

    this._bindCartItemEvents();

    var hasShippingCalculator = section.data.hasShippingCalculator;

    if (hasShippingCalculator) {
      var countrySelect = document.getElementById('address_country');
      var provinceSelect = document.getElementById('address_province');
      var provinceContainer = document.getElementById('address_province_container');
      if (!countrySelect) return;
      var observer = new MutationObserver(function () {
        _this.shippingSelects.forEach(function (select) {
          var previousElementSibling = select.previousElementSibling,
              options = select.options,
              selectedIndex = select.selectedIndex;
          if (!previousElementSibling || !options || !options.length) return;
          previousElementSibling.innerText = options[selectedIndex >= 0 ? selectedIndex : 0].text;
        });
      });
      this.shippingSubmit = this.el.querySelector('[data-shipping-calculator-submit]');

      this.calculateShipping = function () {
        return _this._calculateShipping();
      };

      this.shippingSelects = this.el.querySelectorAll('.cart-shipping-calculator select');
      this.shippingSelects.forEach(function (shippingSelect) {
        return observer.observe(shippingSelect, {
          childList: true
        });
      });
      this.shippingCountryProvinceSelector = new CountryProvinceSelector(countrySelect.innerHTML);
      this.shippingCountryProvinceSelector.build(countrySelect, provinceSelect, {
        onCountryChange: function onCountryChange(provinces) {
          if (provinces.length) {
            provinceContainer.style.display = 'block';
          } else {
            provinceContainer.style.display = 'none';
          } // "Province", "State", "Region", etc. and "Postal Code", "ZIP Code", etc.
          // Even countries without provinces include a label.


          var _window$Countries$cou = window.Countries[countrySelect.value],
              label = _window$Countries$cou.label,
              zipLabel = _window$Countries$cou.zip_label;
          provinceContainer.querySelector('label[for="address_province"]').innerHTML = label;
          _this.el.querySelector('label[for="address_zip"]').innerHTML = zipLabel;
        }
      });
      this.shippingSubmit.addEventListener('click', this.calculateShipping);

      if (window.Theme.customerAddress) {
        this._calculateShipping(window.Theme.customerAddress);
      }
    }
  }

  StaticCart_createClass(StaticCart, [{
    key: "_bindCartItemEvents",
    value: function _bindCartItemEvents() {
      var _this2 = this;

      this.quantityInputs = this.el.querySelectorAll('[data-quantity-key]');
      this.removeItem = this.el.querySelectorAll('[data-remove-item]');
      this.cartTable = this.el.querySelector('[data-cart-table]');
      this.cartDiscountContainer = this.el.querySelector('[data-cart-discount-container]');
      this.totalPrice = this.el.querySelector('[data-total-price]');
      this.quantityInputs.forEach(function (el) {
        return el.addEventListener('input', function (event) {
          return _this2._updateItemQuantity(event);
        });
      });
      this.removeItem.forEach(function (el) {
        return el.addEventListener('click', function (event) {
          return _this2._updateItemQuantity(event);
        });
      });
    }
  }, {
    key: "_unbindCartItemEvents",
    value: function _unbindCartItemEvents() {
      var _this3 = this;

      this.quantityInputs.forEach(function (el) {
        return el.removeEventListener('input', function (event) {
          return _this3._updateItemQuantity(event);
        });
      });
      this.removeItem.forEach(function (el) {
        return el.removeEventListener('click', function (event) {
          return _this3._updateItemQuantity(event);
        });
      });
      this.quantityInputs = null;
      this.removeItem = null;
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      var _this4 = this;

      this.shippingSubmit.removeEventListener('click', this.calculateShipping);

      if (this.cartInstructionsTextarea) {
        this.cartInstructionsTextarea.removeEventListener('change', function () {
          return _this4.saveSpecialInstructions();
        });
      }
    }
  }, {
    key: "_updateItemQuantity",
    value: function _updateItemQuantity(event) {
      var _this5 = this;

      event.preventDefault();
      var quantityInput;
      var quantity;
      var lineItemKey;

      if (event.currentTarget.hasAttribute('data-remove-item')) {
        quantity = 0;
        lineItemKey = event.currentTarget.dataset.removeItem;
      } else {
        quantityInput = event.currentTarget;
        quantity = quantityInput.value;

        if (quantity === '') {
          return;
        }

        lineItemKey = quantityInput.dataset.quantityKey;
      } // cancel any pending requests


      if (this.updateTimeout !== null) {
        clearTimeout(this.updateTimeout);
      }

      this.updateTimeout = setTimeout(function () {
        // Debounce to avoid firing requests while user is still entering number
        var thisTimeoutId = _this5.updateTimeout;
        var request = new XMLHttpRequest();
        request.open('POST', "".concat(window.Theme.routes.cart_change_url, ".js"));
        request.setRequestHeader('Content-Type', 'application/json');
        request.responseType = 'json';

        request.onload = function () {
          var cart = request.response; // If another request is in progress, discard this update

          if (_this5.updateTimeout && _this5.updateTimeout !== thisTimeoutId) {
            return;
          }

          if (cart.item_count === 0) {
            // reload to show empty cart state
            window.location.reload();
            return;
          }

          _this5.updateCart(cart, thisTimeoutId);
        };

        request.send(JSON.stringify({
          quantity: quantity,
          id: lineItemKey
        }));
      }, 300);
    }
  }, {
    key: "updateCart",
    value: function updateCart(cart, timeoutId) {
      var _this6 = this;

      document.querySelector('.cart-count-number').innerText = cart.item_count; // Swap the cart contents to update discount labels.

      shopify_asyncview_dist_index_es.load(window.Theme.routes.cart_url, {
        view: 'ajax'
      }).then(function (_ref) {
        var data = _ref.data,
            html = _ref.html;

        // If another request is in progress, discard this update
        if (_this6.updateTimeout !== timeoutId) {
          return;
        }

        _this6._unbindCartItemEvents(); // Inject new cart table contents


        var newTableContainer = document.createElement('div');
        newTableContainer.innerHTML = html.table;
        morphdom_esm(_this6.cartTable, newTableContainer.querySelector('table'), {
          onBeforeElUpdated: function onBeforeElUpdated(fromEl, toEl) {
            // Skip images if src matches
            // - we don't want to reload lazy loaded images
            if (fromEl.tagName === 'IMG' && fromEl.src === toEl.src) {
              return false;
            }

            return true;
          }
        });
        dist_index_es.watch(_this6.cartTable); // Inject new cart level discounts

        var newDiscountContainer = document.createElement('div');
        newDiscountContainer.innerHTML = html.discounts;
        _this6.cartDiscountContainer.innerHTML = newDiscountContainer.querySelector('[data-cart-discount-container]').innerHTML; // Update total

        _this6.totalPrice.innerHTML = data.totalPrice;

        _this6._bindCartItemEvents();
      }).fail(function () {
        return window.location.reload();
      });
    }
  }, {
    key: "saveSpecialInstructions",
    value: function saveSpecialInstructions() {
      var newNote = this.cartInstructionsTextarea.value;
      var request = new XMLHttpRequest();
      request.open('POST', "/cart/update.js?note=".concat(encodeURI(newNote)));
      request.responseType = 'json';
      request.send();
    }
  }, {
    key: "_calculateShipping",
    value: function _calculateShipping(customerAddress) {
      var _this7 = this;

      var shippingAddress = {};

      if (customerAddress) {
        shippingAddress = customerAddress;
      } else {
        var addressCountry = document.querySelector('#address_country');
        var addressProvince = document.querySelector('#address_province');
        var addressZip = document.querySelector('#address_zip');
        shippingAddress.country = addressCountry ? addressCountry.value : '';
        shippingAddress.province = addressProvince ? addressProvince.value : '';
        shippingAddress.zip = addressZip ? addressZip.value : '';
      }

      var queryString = Object.keys(shippingAddress).map(function (key) {
        return "".concat(encodeURIComponent("shipping_address[".concat(key, "]")), "=").concat(encodeURIComponent(shippingAddress[key]));
      }).join('&');
      var request = new XMLHttpRequest();
      request.open('GET', "/cart/shipping_rates.json?".concat(queryString));
      request.responseType = 'json';

      request.onload = function () {
        var status = request.status,
            response = request.response;

        if (status === 422) {
          _this7._handleErrors(response);

          return;
        }

        var rates = response.shipping_rates;
        var address = "".concat(shippingAddress.zip, ", ").concat(shippingAddress.province, ", ").concat(shippingAddress.country);

        if (!shippingAddress.province.length) {
          address = "".concat(shippingAddress.zip, ", ").concat(shippingAddress.country);
        }

        if (!shippingAddress.zip.length) {
          address = "".concat(shippingAddress.province, ", ").concat(shippingAddress.country);
        }

        if (!shippingAddress.province.length || !shippingAddress.zip.length) {
          address = shippingAddress.country;
        }

        var cartShippingCalculatorResponse = _this7.el.querySelector('.cart-shipping-calculator-response');

        cartShippingCalculatorResponse.innerHTML = '<p class="shipping-calculator-response message"></p><ul class="shipping-rates"/></ul>';

        var ratesFeedback = _this7.el.querySelector('.shipping-calculator-response');

        if (rates.length > 1) {
          var firstRate = window.Theme.Currency.formatMoney(rates[0].price, window.Theme.moneyFormat);
          var multipleShippingRates = window.Theme.shippingCalcMultiRates.replace('--address--', address).replace('--number_of_rates--', rates.length).replace('--rate--', "<span class='money'>".concat(firstRate, "</span>"));
          ratesFeedback.innerHTML = multipleShippingRates;
        } else if (rates.length === 1) {
          var oneShippingRate = window.Theme.shippingCalcOneRate.replace('--address--', address);
          ratesFeedback.innerHTML = oneShippingRate;
        } else {
          ratesFeedback.innerHTML = window.Theme.shippingCalcNoRates;
        }

        var cartShippingRates = _this7.el.querySelector('.shipping-rates');

        for (var i = 0; i < rates.length; i++) {
          var rate = rates[i];
          var price = window.Theme.Currency.formatMoney(rate.price, window.Theme.moneyFormat);
          var rateValues = window.Theme.shippingCalcRateValues.replace('--rate_title--', rate.name).replace('--rate--', "<span class='money'>".concat(price, "</span>"));
          var rateEl = document.createElement('li');
          rateEl.innerHTML = rateValues;
          cartShippingRates.appendChild(rateEl);
        }
      };

      request.send();
    }
  }, {
    key: "_handleErrors",
    value: function _handleErrors(errors) {
      var errorMessage = '';

      if ('zip' in errors) {
        errorMessage = window.Theme.shippingCalcErrorMessage.replace('--error_message--', errors.zip);
      } else {
        errorMessage = errors;
      }

      document.querySelector('.cart-shipping-calculator-response').innerHTML = "<p>".concat(errorMessage, "</p>");
    }
  }]);

  return StaticCart;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/StaticBlog.js
function StaticBlog_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticBlog_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticBlog_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticBlog_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticBlog_defineProperties(Constructor, staticProps); return Constructor; }



var StaticBlog = /*#__PURE__*/function () {
  function StaticBlog(section) {
    StaticBlog_classCallCheck(this, StaticBlog);

    this.el = section.el;
    this.initializedClass = 'blog-initialized';

    this._validate();
  }

  StaticBlog_createClass(StaticBlog, [{
    key: "onSectionLoad",
    value: function onSectionLoad() {
      this._validate();
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      var _this = this;

      window.removeEventListener('resize', function () {
        _this.setupFullWidthImages();

        if (window.innerWidth <= 1080) {
          _this.positionSidebar('below');
        } else {
          _this.positionSidebar();

          _this.setupFeaturedImage();
        }
      });
      var filterSelect = this.el.querySelector('.blog-tag-filter select');

      if (filterSelect) {
        filterSelect.removeEventListener('change', function (event) {
          return _this.filterBlog(event);
        });
      }
    }
  }, {
    key: "_validate",
    value: function _validate() {
      var _this2 = this;

      if (window.innerWidth <= 1080) {
        this.positionSidebar('below');
      } else {
        this.positionSidebar();
      }

      this.setupFeaturedImage();
      this.setupFullWidthImages();
      window.addEventListener('resize', function () {
        _this2.setupFullWidthImages();

        if (window.innerWidth <= 1080) {
          _this2.positionSidebar('below');
        } else {
          _this2.positionSidebar();

          _this2.setupFeaturedImage();
        }
      });
      var filterSelect = this.el.querySelector('.blog-tag-filter select');

      if (filterSelect) {
        new Select({
          el: filterSelect
        });
        filterSelect.addEventListener('change', function (event) {
          return _this2.filterBlog(event);
        });
      }
    }
  }, {
    key: "filterBlog",
    value: function filterBlog(e) {
      if (!this.el.querySelector('[data-tag-filter]')) {
        return;
      }

      var _e$target = e.target,
          tag = _e$target.tag,
          dataset = _e$target.dataset;
      var url = dataset.url;
      window.location.href = tag === 'all' ? "/blogs/".concat(url) : "/blogs/".concat(url, "/tagged/").concat(tag);
    }
  }, {
    key: "setupFeaturedImage",
    value: function setupFeaturedImage() {
      var posts = this.el.querySelectorAll('.blog-post');
      posts.forEach(function (post) {
        var image = post.querySelector('img.highlight');

        if (image) {
          image.addEventListener('rimg:load', function () {
            post.querySelector('.blog-post-inner').style.paddingTop = "".concat(image.getBoundingClientRect().height - 60, "px");
          });
        }
      });
    }
  }, {
    key: "setupFullWidthImages",
    value: function setupFullWidthImages() {
      var postContent = this.el.querySelector('.post-content');
      var postContentWidth = postContent.getBoundingClientRect().width;
      var postContentMargin = postContent.style.marginLeft;
      this.el.querySelectorAll('img.full-width').forEach(function (image) {
        image.style.width = "".concat(postContentWidth, "px");
        image.style.left = "-".concat(postContentMargin, "px");
      });
    }
  }, {
    key: "positionSidebar",
    value: function positionSidebar(position) {
      var wrapper = this.el.querySelector('.blog-posts');
      var sidebar = this.el.querySelector('.blog-sidebar');

      if (position === 'below') {
        wrapper.parentNode.insertBefore(sidebar, wrapper.nextSibling);
      } else {
        wrapper.parentNode.insertBefore(sidebar, wrapper);
      }
    }
  }]);

  return StaticBlog;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/StaticBlogMasonry.js
function StaticBlogMasonry_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticBlogMasonry_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticBlogMasonry_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticBlogMasonry_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticBlogMasonry_defineProperties(Constructor, staticProps); return Constructor; }



var StaticBlogMasonry = /*#__PURE__*/function () {
  function StaticBlogMasonry(_ref) {
    var el = _ref.el;

    StaticBlogMasonry_classCallCheck(this, StaticBlogMasonry);

    var masonry = el.querySelector('[data-masonry-grid]');
    this.masonryGrid = new MasonryGrid({
      el: masonry
    });
  }

  StaticBlogMasonry_createClass(StaticBlogMasonry, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      return this.masonryGrid.unload();
    }
  }]);

  return StaticBlogMasonry;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/StaticCollectionsList.js
function StaticCollectionsList_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticCollectionsList_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticCollectionsList_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticCollectionsList_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticCollectionsList_defineProperties(Constructor, staticProps); return Constructor; }



var StaticCollectionsList = /*#__PURE__*/function () {
  function StaticCollectionsList(section) {
    StaticCollectionsList_classCallCheck(this, StaticCollectionsList);

    this.el = section.el;
    this.masonry = this.el.querySelector('[data-masonry-grid]');
    this.masonryGrid = null;

    if (this.masonry) {
      this.masonryGrid = new MasonryGrid({
        el: this.masonry
      });
    }
  }

  StaticCollectionsList_createClass(StaticCollectionsList, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.masonryGrid) {
        this.masonryGrid.unload();
      }
    }
  }]);

  return StaticCollectionsList;
}();


;// CONCATENATED MODULE: ./source/scripts/components/ProductMasonry.js
function ProductMasonry_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProductMasonry_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProductMasonry_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductMasonry_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductMasonry_defineProperties(Constructor, staticProps); return Constructor; }





var ProductMasonry = /*#__PURE__*/function () {
  function ProductMasonry(_ref) {
    var el = _ref.el;

    ProductMasonry_classCallCheck(this, ProductMasonry);

    this.el = el;
    this.selectors = {
      gallery: {
        el: '[data-masonry-gallery]',
        itemSelector: '.product-gallery--viewport--figure',
        columnWidth: '[data-masonry-image-sizer]'
      },
      relatedProducts: {
        el: '[data-masonry-products]',
        itemSelector: '.product-list-item',
        columnWidth: '[data-masonry-products-sizer]'
      }
    };
    this.masonry = {
      gallery: null,
      relatedProducts: null
    };
    this.flickity = {
      gallery: null,
      relatedProducts: null
    };
    this.gallery = this.el.querySelector(this.selectors.gallery.el);
    this.relatedProducts = this.el.querySelector(this.selectors.relatedProducts.el);
    this.hasGallery = !!this.gallery;
    this.hasRelatedProducts = !!this.relatedProducts;
    this._initLayout = this._initLayout.bind(this);

    this._bindEvents();

    this._initLayout();
  }

  ProductMasonry_createClass(ProductMasonry, [{
    key: "remove",
    value: function remove() {
      window.removeEventListener('resize', this.resizeDebouncedEvent);
      this.gallery.removeEventListener('product-masonry-layout', this.flickityResizeEvent);
      this.relatedProducts.removeEventListener('product-masonry-layout', this.flickityResizeEvent);
      this.el.removeEventListener('rimg:load', this.onRimgLoadEvent);

      if (this.flickity) {
        this._destroyFlickity();
      }

      if (this.masonry) {
        this._destroyMasonry();
      }
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      this.remove();
    }
  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      var _this = this;

      this.onRimgLoadEvent = function () {
        if (_this.flickity.gallery) {
          scripts_themeUtils.flickityResize(_this.flickity.gallery);
        }

        if (_this.flickity.relatedProducts) {
          scripts_themeUtils.flickityResize(_this.flickity.relatedProducts);
        }
      };

      this.resizeDebouncedEvent = scripts_themeUtils.debounce(this._initLayout, 100);
      window.addEventListener('resize', this.resizeDebouncedEvent);
      this.el.addEventListener('rimg:load', this.onRimgLoadEvent);
    }
  }, {
    key: "_initLayout",
    value: function _initLayout() {
      if (scripts_themeUtils.isSmall()) {
        this._initMobile();
      } else {
        this._initDesktop();
      }
    }
  }, {
    key: "_initMobile",
    value: function _initMobile() {
      this._destroyMasonry();

      this._initFlickity();
    }
  }, {
    key: "_initDesktop",
    value: function _initDesktop() {
      this._destroyFlickity();

      this._initMasonry();
    }
  }, {
    key: "_initFlickity",
    value: function _initFlickity() {
      if (this.hasGallery && !this.flickity.gallery) {
        this._galleryReset();

        this.flickity.gallery = new (js_default())(this.gallery, {
          cellAlign: 'left',
          cellSelector: this.selectors.gallery.itemSelector,
          contain: false,
          percentPosition: false,
          prevNextButtons: true,
          adaptiveHeight: true,
          pageDots: true,
          setGallerySize: false,
          lazyLoad: false
        });

        this._flickityEvents({
          el: this.gallery,
          flickity: this.flickity.gallery
        });
      }

      if (this.hasRelatedProducts && !this.flickity.relatedProducts) {
        this._relatedProductsReset();

        this.flickity.relatedProducts = new (js_default())(this.relatedProducts, {
          cellAlign: 'left',
          cellSelector: this.selectors.relatedProducts.itemSelector,
          contain: true,
          prevNextButtons: false,
          pageDots: false,
          setGallerySize: false
        });

        this._flickityEvents({
          el: this.relatedProducts,
          flickity: this.flickity.relatedProducts
        });
      }
    }
  }, {
    key: "_destroyFlickity",
    value: function _destroyFlickity() {
      if (this.flickity.gallery) {
        this.flickity.gallery.destroy();
        this.flickity.gallery = null;
        window.removeEventListener('resize', this.flickityDebouncedEvent);
      }

      if (this.flickity.relatedProducts) {
        this.flickity.relatedProducts.destroy();
        this.flickity.relatedProducts = null;
      }
    }
  }, {
    key: "_initMasonry",
    value: function _initMasonry() {
      if (this.hasGallery && !this.masonry.gallery) {
        this._galleryReset();

        this.masonry.gallery = new MasonryGrid({
          el: this.gallery,
          settings: {
            itemSelector: this.selectors.gallery.itemSelector,
            columnWidth: this.selectors.gallery.columnWidth
          }
        });
      }

      if (this.hasRelatedProducts && !this.masonry.relatedProducts) {
        this._relatedProductsReset();

        this.masonry.relatedProducts = new MasonryGrid({
          el: this.relatedProducts,
          settings: {
            itemSelector: this.selectors.relatedProducts.itemSelector,
            columnWidth: this.selectors.relatedProducts.columnWidth
          }
        });
      }
    }
  }, {
    key: "_destroyMasonry",
    value: function _destroyMasonry() {
      if (this.masonry.gallery) {
        this.masonry.gallery.unload();
        this.masonry.gallery = null;
      }

      if (this.masonry.relatedProducts) {
        this.masonry.relatedProducts.unload();
        this.masonry.relatedProducts = null;
      }
    }
  }, {
    key: "_galleryReset",
    value: function _galleryReset() {
      this.gallery.querySelectorAll(this.selectors.gallery.itemSelector).forEach(function (item) {
        return item.setAttribute('style', '');
      });
    }
  }, {
    key: "_relatedProductsReset",
    value: function _relatedProductsReset() {
      this.relatedProducts.querySelectorAll(this.selectors.relatedProducts.itemSelector).forEach(function (item) {
        return item.setAttribute('style', '');
      });
    }
  }, {
    key: "_flickityEvents",
    value: function _flickityEvents(_ref2) {
      var el = _ref2.el,
          flickity = _ref2.flickity;
      var event = document.createEvent('Event');
      event.initEvent('product-masonry-layout', true, true);

      this.flickityResizeEvent = function () {
        return scripts_themeUtils.flickityResize(flickity);
      };

      this.flickityDebouncedEvent = scripts_themeUtils.debounce(function () {
        return el.dispatchEvent(event);
      }, 10);
      flickity.on('cellSelect', function () {
        return el.dispatchEvent(event);
      });
      flickity.on('settle', function () {
        return el.dispatchEvent(event);
      });
      el.addEventListener('product-masonry-layout', this.flickityResizeEvent); // Sets the Slider to the height of the first slide

      el.dispatchEvent(event);
      window.addEventListener('resize', this.flickityDebouncedEvent);
    }
  }]);

  return ProductMasonry;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/StaticProductRecommendations.js
function StaticProductRecommendations_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function StaticProductRecommendations_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function StaticProductRecommendations_createClass(Constructor, protoProps, staticProps) { if (protoProps) StaticProductRecommendations_defineProperties(Constructor.prototype, protoProps); if (staticProps) StaticProductRecommendations_defineProperties(Constructor, staticProps); return Constructor; }

 // eslint-disable-line




var StaticProductRecommendations = /*#__PURE__*/function () {
  function StaticProductRecommendations(section) {
    StaticProductRecommendations_classCallCheck(this, StaticProductRecommendations);

    this.data = section.data;

    this._init();

    this.recommendUrl = "".concat(window.Theme.routes.product_recommendations_url, "?section_id=static-product-recommendations&product_id=").concat(this.productId);
    this._reloadRecommendations = this._reloadRecommendations.bind(this);
    window.addEventListener('shopify:section:load', this._reloadRecommendations);

    this._loadRecommendations();
  }

  StaticProductRecommendations_createClass(StaticProductRecommendations, [{
    key: "_init",
    value: function _init() {
      this.productId = this.data.productId;
      this.position = this.data.position;
      var productSectionData = JSON.parse(document.querySelector('[data-section-type="product"]').innerHTML);
      this.use_masonry = productSectionData.images_layout === 'masonry';

      if (this.use_masonry) {
        this.position = 'below';
      }

      this.productEl = document.querySelector('.product');
      this.productEl.classList.add("product-recommendations-position-".concat(this.position));
      this.recommendationContainer = document.querySelector('[data-product-recommendations]');
      this.recommendationContainer.innerHTML = '';
    }
  }, {
    key: "_loadRecommendations",
    value: function _loadRecommendations() {
      var _this = this;

      shopify_asyncview_dist_index_es.load(this.recommendUrl, {
        view: ''
      }).then(function (_ref) {
        var html = _ref.html;

        if (!html.common) {
          return;
        }

        var tempContainer = document.createElement('div');
        tempContainer.innerHTML = html.common;
        var productsWrapper = tempContainer.querySelector('.product-recommendations');

        if (_this.position === 'below' || _this.use_masonry) {
          productsWrapper.innerHTML = html.below;
        } else {
          productsWrapper.innerHTML = html.right;
        }

        if (_this.use_masonry) {
          productsWrapper.classList.remove('row-of-4');
          productsWrapper.classList.add('row-of-3');
        } else {
          // Remove extra products for non-masonry layouts
          productsWrapper.querySelectorAll('[data-masonry-only]').forEach(function (product) {
            return product.parentNode.removeChild(product);
          });
        }

        _this.recommendationContainer.innerHTML = tempContainer.innerHTML;

        if (_this.use_masonry) {
          _this.productMasonry = new ProductMasonry({
            el: _this.recommendationContainer
          });
        }

        dist_index_es.watch(_this.recommendationContainer);

        var productItems = _this.recommendationContainer.querySelectorAll('.product-list-item');

        if (productItems.length) {
          if (window.Shopify && Shopify.PaymentButton) {
            Shopify.PaymentButton.init();
          }
        }
      });
    } // This method is only called inside of the theme editor
    // when the user changes product section settings

  }, {
    key: "_reloadRecommendations",
    value: function _reloadRecommendations() {
      this._init();

      this._loadRecommendations();
    }
  }, {
    key: "onSectionUnload",
    value: function onSectionUnload() {
      if (this.productMasonry) {
        this.productMasonry.onSectionUnload();
      }

      this.productEl.classList.remove("product-recommendations-position-".concat(this.position));
      this.recommendationContainer.innerHTML = '';
      window.removeEventListener('shopify:section:load', this._reloadRecommendations);
    }
  }]);

  return StaticProductRecommendations;
}();


;// CONCATENATED MODULE: ./source/scripts/sections/ProductSection.js
function ProductSection_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ProductSection_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ProductSection_createClass(Constructor, protoProps, staticProps) { if (protoProps) ProductSection_defineProperties(Constructor.prototype, protoProps); if (staticProps) ProductSection_defineProperties(Constructor, staticProps); return Constructor; }



var ProductSection = /*#__PURE__*/function () {
  function ProductSection(section) {
    ProductSection_classCallCheck(this, ProductSection);

    this.product = new Product(section.el, section.data);
  }

  ProductSection_createClass(ProductSection, [{
    key: "onSectionUnload",
    value: function onSectionUnload() {
      return this.product.unload();
    }
  }]);

  return ProductSection;
}();


;// CONCATENATED MODULE: ./source/scripts/grid.js






 // Flickity iOS fix

 // Templates



 // Components


 // Dynamic Sections








 // Static sections












function spamCheck(e) {
  if (e.target.querySelector('.comment-check').value.length > 0) {
    e.preventDefault();
  }
}

dist_index_es.init();
var sections = new shopify_sections_manager_es(); // Dynamic Sections

sections.register('dynamic-blog', function (section) {
  return new DynamicBlog(section);
});
sections.register('dynamic-collections-list', function (section) {
  return new DynamicCollectionsList(section);
});
sections.register('dynamic-featured-collection', function (section) {
  return new DynamicFeaturedCollection(section);
});
sections.register('dynamic-masonry', function (section) {
  return new DynamicMasonry(section);
});
sections.register('dynamic-promotion', function (section) {
  return new DynamicPromotion(section);
});
sections.register('dynamic-slideshow', function (section) {
  return new DynamicSlideshow(section);
});
sections.register('dynamic-testimonials', function (section) {
  return new DynamicTestimonials(section);
});
sections.register('dynamic-video-with-text-overlay', function (section) {
  return new DynamicVideoWithTextOverlay(section);
});
sections.register('product', function (section) {
  return new ProductSection(section);
});
sections.register('pxs-map', function (section) {
  return new pxs_map_dist_index_es(section);
}); // Static Sections

sections.register('static-article', function (section) {
  return new StaticArticle(section);
});
sections.register('static-collection', function (section) {
  return new StaticCollection(section);
});
sections.register('static-collections-list', function (section) {
  return new StaticCollectionsList(section);
});
sections.register('static-header', function (section) {
  return new StaticHeader(section);
});
sections.register('static-footer', function (section) {
  return new StaticFooter(section);
});
sections.register('static-cart', function (section) {
  return new StaticCart(section);
});
sections.register('static-blog', function (section) {
  return new StaticBlog(section);
});
sections.register('static-blog-masonry', function (section) {
  return new StaticBlogMasonry(section);
});
sections.register('static-product-recommendations', function (section) {
  return new StaticProductRecommendations(section);
});
FlickityTouchFix();
var contactForm = document.querySelector('.contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    return spamCheck(event);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  return document.documentElement.classList.remove('loading');
}); // Set up conditionals

var isProduct = document.body.classList.contains('template-product');
var isAccount = document.body.getAttribute('class').indexOf('-customers-') > 0;
var isPasswordPage = document.body.classList.contains('template-password');
var isGiftCardPage = document.body.classList.contains('template-gift_card');

if (isAccount) {
  new TemplateAccount({
    el: document.body
  });
}

if (isPasswordPage) {
  new TemplateLogin();
}

if (isGiftCardPage) {
  new TemplateGiftCard();
}

if (!isProduct) {
  document.querySelectorAll('.rte').forEach(function (rte) {
    return new RTE({
      el: rte
    });
  });
  document.querySelectorAll('select').forEach(function (sel) {
    return new Select({
      el: sel
    });
  });
}
}();
/******/ })()
;
//# sourceMappingURL=grid.js.map?1623945147337