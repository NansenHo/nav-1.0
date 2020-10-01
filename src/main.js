const $siteList = $('.siteList')
// 找到 siteList ，用 jQuery 找的
const $lastLi = $siteList.find('li.last') 
const x = localStorage.getItem('x') // 读已经存了的 x
// 但 x 目前还是字符串，还要将它变成对象
// console.log('x')
// console.log(x)
const xObject = JSON.parse(x) // 将字符串变成对象
// console.log('xObject')
// console.log(xObject)
const hashMap = xObject || [
    {logo: 'Z', url: 'https://zhihu.com'},
    {logo: 'B', url: 'https://www.bilibili.com'},
]
const simplifyUrl = (url) => {
    return url.replace('https://', '')
      .replace('http://', '')
      .replace('www.', '')
      .replace(/\/.*/, '') // 删除 / 开头的内容
  } // 接受一个 https:// 开头的 url ，则返回没有 https:// 开头的 url。原本的 url 并没有变，这里是产生了一个新的字符串
const render = ()=>{ // 优化代码，render 函数就是渲染哈希的
    // 在重新渲染之前要把之前的给删了
    $siteList.find('li:not(.last)').remove() // 把所有 li 都找到，唯独不找最后那一个 li ，然后删掉
    // 现在删这个弄这么复杂，是因为我们 HTML 就没有设计好。但如果放外面 CSS 也会很难写
    hashMap.forEach((node, index)=>{ // 给个索引，方便做 remove 功能
        // console.log(index)
        const $li = $( `<li>
                    <div class="site">
                        <div class="logo">${node.logo}</div>
                        <div class="link">${simplifyUrl(node.url)}</div>
                        <div class="close"> 
                            <svg class="icon">
                            <use xlink:href="#icon-baseline-close-px"></use>
                            </svg>
                        </div>
                    </div>
                </li>`).insertBefore($lastLi)
                $li.on('click', ()=>{
                    window.open(node.url)
                })
                $li.on('click', '.close', (e)=>{ // 得到一个事件
                    console.log('这里')
                    e.stopPropagation()
                    console.log(hashMap)
                    hashMap.splice(index, 1) // 从 index 这里，删掉一个
                    render() // 删除了之后还要重新渲染 hashMap
                }) // 当你点击我 li 里面的 class="close" 时，阻止冒泡
    }) // 遍历 hashMap，forEach 会把每一项作为参数告诉你。   
}
render()

{/* <li>
                <a href="https://zhihu.com">
                    <div class="site">
                        <div class="logo">Z</div>
                        <div class="link">zhihu.com</div>
                    </div>
                </a>
            </li>
            <li>
                <a href="https://www.bilibili.com">
                    <div class="site">
                        <div class="logo">
                            <img src="../images/bilibili-logo.png" alt="">
                        </div>
                        <div class="link">bilibili.com</div>
                    </div>
                </a>
            </li>
             */}
$('.addButton') // 获取 .addButton
    .on('click', ()=>{ 
        let url = window.prompt('请输入您想要添加的网站')
        console.log(url)
        // 我们可以对用户输入的 url 进行测试
        if(url.indexOf('http') !== 0) {
            // 不是 http 开头的，即 http 的 index 不等于 0。
            url = 'https://' + url // 相比起相面的给提示信息，这种帮用户改正的交互更好
            // alert('请输入 http 开头的网址')
            // 我们就提示用户 请输入 http 开头的网址 。
        }
        console.log(url)
        // console.log($siteList) // 注意，jQuery 打出来的是一个 api
        // const $li = $(`
        // <li>
        //         <a href="${url}">
        //             <div class="site">
        //                 <div class="logo">${url[0]}</div>
        //                 <div class="link">${url}</div>
        //             </div>
        //         </a>
        //     </li>
        // `).insertBefore($lastLi)
        // 当点击的时候，不再创建 li 了，而是直接操作哈希表，然后让问题变成一个简单的只有渲染哈希表的一个事。
        hashMap.push({
            logo: simplifyUrl(url)[0].toUpperCase(), 
            // 把 url 简化，
            // toUpperCase 将字母改成大写，或者也可以用 CSS 来控制。
            logoType:'text', 
            url: url}
        )
        render()
    })

window.onbeforeunload = ()=>{ 
    // console.log('页面要关闭了')
    // 因为 localStorage 只能存字符串，所以要把哈希表变成字符串
    const string = JSON.stringify(hashMap) // JSON.stringify 可以把一个对象变成字符串
    // console.log(typeof hashMap)
    // console.log(hashMap)
    // console.log(typeof string)
    // console.log(string)
    window.localStorage.setItem('x', string) // window 可以省略，我这里先不省略。接受两个值，一个是 key ，一个是 value
    // 上行代码的意思就是，在本地设置一个 x ，它的值就是 string
}
// 键盘导航
// document.addEventListener{
// }
// 或者我们也可以用 jQuery 包装以下
$(document).on('keypress', (e)=>{ // keypress 用户按下键盘
    // const key = e.key 当你的变量名和属性名同名时，可以简写为下一行
    const {key} = e 
    for(let i=0; i<hashMap.length; i++){ // hashMap 是个数组，遍历这个数组
        if(hashMap[i].logo.toLowerCase() === key) // logo 要转化成小写
        window.open(hashMap[i].url) // 那就打开 hashMap 的第 i 个的 url
    }
})