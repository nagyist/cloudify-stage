(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/**
 * Created by pawelposel on 04/11/2016.
 */

Stage.addPlugin({
    id: "pluginsNum",
    name: "Number of plugins",
    description: 'Number of plugins',
    initialWidth: 2,
    initialHeight: 2,
    color: "teal",
    showHeader: false,
    isReact: true,

    fetchData: function fetchData(plugin, context, pluginUtils) {
        return new Promise(function (resolve, reject) {
            pluginUtils.jQuery.get({
                url: context.getManagerUrl() + '/api/v2.1/plugins?_include=id',
                dataType: 'json'
            }).done(function (plugins) {
                resolve({ number: plugins.metadata.pagination.total });
            }).fail(reject);
        });
    },

    render: function render(widget, data, error, context, pluginUtils) {
        if (!data) {
            return pluginUtils.renderReactLoading();
        }

        if (error) {
            return pluginUtils.renderReactError(error);
        }

        var KeyIndicator = Stage.Basic.KeyIndicator;

        return React.createElement(KeyIndicator, { title: "Plugins", icon: "plug", number: data.number });
    }
});

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwbHVnaW5zL3BsdWdpbnNOdW0vc3JjL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7QUFJQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDWixRQUFJLFlBRFE7QUFFWixVQUFNLG1CQUZNO0FBR1osaUJBQWEsbUJBSEQ7QUFJWixrQkFBYyxDQUpGO0FBS1osbUJBQWUsQ0FMSDtBQU1aLFdBQVEsTUFOSTtBQU9aLGdCQUFZLEtBUEE7QUFRWixhQUFTLElBUkc7O0FBVVosZUFBVyxtQkFBUyxNQUFULEVBQWdCLE9BQWhCLEVBQXdCLFdBQXhCLEVBQXFDO0FBQzVDLGVBQU8sSUFBSSxPQUFKLENBQWEsVUFBQyxPQUFELEVBQVMsTUFBVCxFQUFvQjtBQUNwQyx3QkFBWSxNQUFaLENBQW1CLEdBQW5CLENBQXVCO0FBQ25CLHFCQUFLLFFBQVEsYUFBUixLQUEwQiwrQkFEWjtBQUVuQiwwQkFBVTtBQUZTLGFBQXZCLEVBR0csSUFISCxDQUdRLFVBQUMsT0FBRCxFQUFZO0FBQ2hCLHdCQUFRLEVBQUMsUUFBUSxRQUFRLFFBQVIsQ0FBaUIsVUFBakIsQ0FBNEIsS0FBckMsRUFBUjtBQUNILGFBTEQsRUFLRyxJQUxILENBS1EsTUFMUjtBQU1ILFNBUE0sQ0FBUDtBQVFILEtBbkJXOztBQXFCWixZQUFRLGdCQUFTLE1BQVQsRUFBZ0IsSUFBaEIsRUFBcUIsS0FBckIsRUFBMkIsT0FBM0IsRUFBbUMsV0FBbkMsRUFBZ0Q7QUFDcEQsWUFBSSxDQUFDLElBQUwsRUFBVztBQUNQLG1CQUFPLFlBQVksa0JBQVosRUFBUDtBQUNIOztBQUVELFlBQUksS0FBSixFQUFXO0FBQ1AsbUJBQU8sWUFBWSxnQkFBWixDQUE2QixLQUE3QixDQUFQO0FBQ0g7O0FBRUQsWUFBSSxlQUFlLE1BQU0sS0FBTixDQUFZLFlBQS9COztBQUVBLGVBQ0ksb0JBQUMsWUFBRCxJQUFjLE9BQU0sU0FBcEIsRUFBOEIsTUFBSyxNQUFuQyxFQUEwQyxRQUFRLEtBQUssTUFBdkQsR0FESjtBQUdIO0FBbkNXLENBQWhCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogQ3JlYXRlZCBieSBwYXdlbHBvc2VsIG9uIDA0LzExLzIwMTYuXG4gKi9cblxuU3RhZ2UuYWRkUGx1Z2luKHtcbiAgICBpZDogXCJwbHVnaW5zTnVtXCIsXG4gICAgbmFtZTogXCJOdW1iZXIgb2YgcGx1Z2luc1wiLFxuICAgIGRlc2NyaXB0aW9uOiAnTnVtYmVyIG9mIHBsdWdpbnMnLFxuICAgIGluaXRpYWxXaWR0aDogMixcbiAgICBpbml0aWFsSGVpZ2h0OiAyLFxuICAgIGNvbG9yIDogXCJ0ZWFsXCIsXG4gICAgc2hvd0hlYWRlcjogZmFsc2UsXG4gICAgaXNSZWFjdDogdHJ1ZSxcblxuICAgIGZldGNoRGF0YTogZnVuY3Rpb24ocGx1Z2luLGNvbnRleHQscGx1Z2luVXRpbHMpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSxyZWplY3QpID0+IHtcbiAgICAgICAgICAgIHBsdWdpblV0aWxzLmpRdWVyeS5nZXQoe1xuICAgICAgICAgICAgICAgIHVybDogY29udGV4dC5nZXRNYW5hZ2VyVXJsKCkgKyAnL2FwaS92Mi4xL3BsdWdpbnM/X2luY2x1ZGU9aWQnLFxuICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgICAgICAgIH0pLmRvbmUoKHBsdWdpbnMpPT4ge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoe251bWJlcjogcGx1Z2lucy5tZXRhZGF0YS5wYWdpbmF0aW9uLnRvdGFsfSk7XG4gICAgICAgICAgICB9KS5mYWlsKHJlamVjdClcbiAgICAgICAgfSk7XG4gICAgfSxcblxuICAgIHJlbmRlcjogZnVuY3Rpb24od2lkZ2V0LGRhdGEsZXJyb3IsY29udGV4dCxwbHVnaW5VdGlscykge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBwbHVnaW5VdGlscy5yZW5kZXJSZWFjdExvYWRpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIHBsdWdpblV0aWxzLnJlbmRlclJlYWN0RXJyb3IoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IEtleUluZGljYXRvciA9IFN0YWdlLkJhc2ljLktleUluZGljYXRvcjtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEtleUluZGljYXRvciB0aXRsZT1cIlBsdWdpbnNcIiBpY29uPVwicGx1Z1wiIG51bWJlcj17ZGF0YS5udW1iZXJ9Lz5cbiAgICAgICAgKTtcbiAgICB9XG59KTsiXX0=
