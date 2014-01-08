css-find
---

分析 css 文件中某个属性的使用情况

![2014-01-08 11 14 28](https://f.cloud.github.com/assets/163671/1869212/ba7185d8-7877-11e3-95d1-977148f8509a.png)

## Install

```javascript
  npm install css-find -g
```

```
Usage:

  Usage: css-find [options] [file path | url] [css prop]

  Example:
    css-find  ./index.css z-index
    css-find  http://www.douban.com z-index

  Options:

    -l, --values-with-matches <path>   Only print values that don't contain selectors
```

TODO
---

1. url 抓取网页的时候识别 `<style>` 标签内的样式 (Example: baidu.com)

License
---

Apache
