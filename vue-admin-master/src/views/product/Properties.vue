<template>
    <el-container style="height: 630px">
        <el-aside width="300px">
            <el-tree @node-click="handleClick" :data="productTypes" :props="defaultProps"></el-tree>
        </el-aside>
        <el-main>
            <div v-show="propertiesCard">
                <h1>添加{{name}}类型的属性</h1>
                <el-card class="box-card">
                    <el-button type="primary" @click="handleAddProperty">新增</el-button>
                    <div style="height: 20px"></div>
                    <el-row>
                        <el-col :span="4"  :offset="1">是否为sku属性</el-col>
                        <el-col :span="12" :offset="1">属性名称</el-col>
                    </el-row>
                    <div style="margin-left: 20px" v-for="property in properties" class="text item">
                        <el-input v-model="property.specName" class="input-with-select" style="width: 85%">
                            <el-select style="width: 140px" v-model="property.isSku" slot="prepend" placeholder="是否为Sku属性">
                                <el-option label="是" :value=1></el-option>
                                <el-option label="否" :value=0></el-option>
                            </el-select>
                        </el-input>
                        <el-button icon="el-icon-delete" @click="properties.splice(index-1,1)" style="width:10%"></el-button>
                    </div>
                </el-card>
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
                productTypeId: "",
                name:[],
                productTypes: [],
                properties:[],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                id: "",
                pId: "",
                //编辑界面数据
                productType: {
                    name: '',
                    pid: '',
                    description: "",
                    sortIndex: "",
                    description: "",
                },
                propertiesCard:false,
                productTypeLoading: false
            }
        },
        methods:{
            //添加一条属性
            handleAddProperty(){
                //添加默认值
                this.properties.push({"isSku":0});
            },
            loadTree(){
                this.$http.get("/product/productType/tree").then((res)=>{
                   this.productTypes = res.data;
                });
            },
            //加载属性
            loadProperties(id){
                this.$http.get("/product/specification/productTypeId/"+id).then(res=>{
                    this.properties = res.data;
                    this.propertiesCard = true;
                });
            },
            handleSubmit(){
                //表示数据是否有效
                let result = true;
                if(!this.properties.length){
                    //确保有值才能提交
                    result = false;
                }
                //准备数据
                this.properties.forEach(e=>{
                    e.productTypeId = this.productTypeId;

                    if (!e.specName){
                        this.$message({
                            message: "请填写完所有的属性名称",
                            type: 'error'
                        });
                        result = false;
                        return;
                    }
                });
                if(result){
                    this.$http.post("/product/specification/save",this.properties).then(res=>{
                        let data = res.data;
                        if (data.success){
                            this.$message({
                                message: "新增成功",
                                type: 'success'
                            });
                            this.propertiesCard = false;
                            this.loadTree();
                        }else {
                            this.$message({
                                message: data.message,
                                type: 'error'
                            });
                        }
                    });
                }
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
                            this.propertiesCard = false;
                            this.loadTree();
                        }else {
                            this.$message({
                                message: data.message,
                                type: 'error'
                            });
                        }
                    });
                });
            },
            handleClick(data){
                if(!data.children.length){
                    this.name = data.name;
                    this.productTypeId = data.id;
                    this.loadProperties(data.id);
                }
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
</style>