var tempArr = [
  {
    id: 0,
    parentId: null,
    children: [],
  },
  {
    id: 1,
    parentId: 0,
    children: [],
  },
  {
    id: 2,
    parentId: 0,
    children: [],
  },
  {
    id: 3,
    parentId: 1,
    children: [],
  },
  {
    id: 4,
    parentId: 1,
    children: [],
  },
  {
    id: 5,
    parentId: 1,
    children: [],
  },
  {
    id: 6,
    parentId: 1,
    children: [],
  },
  {
    id: 7,
    parentId: 2,
    children: [],
  },
  {
    id: 8,
    parentId: 2,
    children: [],
  },
  {
    id: 9,
    parentId: 2,
    children: [],
  },
  {
    id: 10,
    parentId: 2,
    children: [],
  },
];

function multiArray(arr) {        //一维转多维
  var newArr = [];
  arr.forEach(function (item, index) {
    if (item.parentId === null) {
      newArr.push(item)
    }
    arr.forEach(function (item2, index2) {
      if (item.id === item2.parentId) {
        item.children.push(item2);
      }
    })
  })
  return newArr[0];
}
function flattenArray(arr) {  //多维转一维
  var newArr = [];
  return (function fn(arr) {
    if (Object.prototype.toString.call(arr) === '[object Object]') {
      var att = arr.children && arr.children.length ? JSON.parse(JSON.stringify(arr.children)) : [];
      arr.children = [];
      newArr.push(arr);
      fn(att);
    } else {
      arr.forEach(function (item, index) {
        console.log(item.children.length, 66)
        if (item.children.length) {
          var att = JSON.parse(JSON.stringify(item.children));
          item.children = [];
          newArr.push(item);
          fn(att);
        } else {
          newArr.push(item);
        }

      })
    }
    return newArr;
  })(arr)
}

// 函数有副作用，有引用的问题，要利用深拷贝来解决
console.log(multiArray(tempArr))
console.log(flattenArray(multiArray(tempArr)));
