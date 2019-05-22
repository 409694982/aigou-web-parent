<template>
    <el-container style="height: 630px">
        <el-aside width="300px">
            <el-tree @node-contextmenu="rightClick" :data="productTypes" :props="defaultProps"></el-tree>
            <div v-show="menuVisible">
                <ul id="menu" class="menu">
                    <li class="menu__item" @click="sameLevel">平级添加</li>
                    <li class="menu__item" @click="lowerLevel">下级添加</li>
                    <li class="menu__item" @click="handleRemove">删除</li>
                </ul>
            </div>
        </el-aside>
        <el-main>
            <div v-show="productTypeForm">
                <h1>添加{{title}}级类型</h1>
                <el-form :model="productType" label-width="80px" ref="productType">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="productType.name" placeholder="请输入品牌名称"></el-input>
                    </el-form-item>
                    <el-form-item label="序号" prop="sortIndex">
                        <el-input v-model="productType.sortIndex" placeholder="请输入序号"></el-input>
                    </el-form-item>
                    <el-form-item label="详情">
                        <el-input type="textarea" v-model="productType.description" placeholder="请输入详情"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="">取消</el-button>
                    <el-button type="primary" @click.native="handleSubmit" :loading="productTypeLoading">提交</el-button>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "app",
        data(){
            return{
                productTypes:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                id: "",
                pId: "",
                title: "!!!",
                menuVisible: false,
                //编辑界面数据
                productType: {
                    name: '',
                    pid: '',
                    description: "",
                    sortIndex: "",
                    description: "",
                },
                productTypeForm:false,
                productTypeLoading: false
            }
        },
        methods:{
            loadTree(){
                this.$http.get("/product/productType/tree").then((res)=>{
                   this.productTypes = res.data;
                });
            },
            lowerLevel(){
                this.productType = {
                    name: '',
                    pid: this.id,
                    description: "",
                    sortIndex: "",
                    description: "",
                };
                this.title = "下";
                this.productTypeForm = true;
            },
            sameLevel(){
                this.productType = {
                    name: '',
                    pid: this.pid,
                    description: "",
                    sortIndex: "",
                    description: "",
                };
                this.title = "平";
                this.productTypeForm = true;
            },
            rightClick(MouseEvent, object, Node, VueComponent){
                this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
                this.menuVisible = true // 显示模态窗口，跳出自定义菜单栏
                var menu = document.querySelector('#menu')
                menu.style.left = MouseEvent.clientX + 'px'
                document.addEventListener('click', this.foo) // 给整个document添加监听鼠标事件，点击任何位置执行foo方法
                menu.style.top = MouseEvent.clientY -80 + 'px'
                this.id = object.id;
                this.pid = object.pid;
                // console.log('右键被点击的event:', MouseEvent)
                // console.log('右键被点击的object:', object)
                // console.log('右键被点击的value:', Node)
                // console.log('右键被点击的element:', VueComponent)
                // console.log('鼠标点击了树形结构图')
                console.debug(this.id)
                console.debug(this.pid)
            },
            foo() { // 取消鼠标监听事件 菜单栏
                this.menuVisible = false
                document.removeEventListener('click', this.foo) // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
            },
            handleSubmit(){
                this.$http.post("/product/productType",this.productType).then(res=>{
                    let data = res.data;
                    if (data.success){
                        this.$message({
                            message: "新增成功",
                            type: 'success'
                        });
                        this.productTypeForm = false;
                        this.loadTree();
                    }else {
                        this.$message({
                            message: data.message,
                            type: 'error'
                        });
                    }
                });
            },
            handleRemove(){
                this.$confirm('确认删除该类型吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.$http.delete("/product/productType/"+this.id).then(res=>{
                        let data = res.data;
                        if (data.success){
                            this.$message({
                                message: "删除成功！",
                                type: 'success'
                            });
                            this.productTypeForm = false;
                            this.loadTree();
                        }else {
                            this.$message({
                                message: data.message,
                                type: 'error'
                            });
                        }
                    });
                });
            }

        },
        mounted(){
            this.loadTree();
        }
    }
</script>

<style scoped>
    .el-aside{
        border:1px solid #ccc;
        border-right: none;
    }
    .el-main{
        border:1px solid #ccc;
    }
    .menu__item {
        display: block;
        line-height: 20px;
        text-align: center;
        margin-top: 10px;
    }
    .menu {
        height: 100px;
        width: 100px;
        position: absolute;
        border-radius: 10px;
        border: 1px solid #999999;
        background-color: #f4f4f4;
    }
    li:hover {
        background-color: #1790ff;
        color: white;
    }
</style>