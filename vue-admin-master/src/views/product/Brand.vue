<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.keyword" placeholder="关键字"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="handleSearch">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="brands" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="名称" sortable>
			</el-table-column>
			<el-table-column prop="englishName" label="英文名" sortable>
			</el-table-column>
			<el-table-column prop="sortIndex" label="首字母" sortable>
			</el-table-column>
			<el-table-column prop="productType.name" label="商品类型" sortable>
			</el-table-column>
			<el-table-column prop="logo" label="品牌logo" sortable>
			</el-table-column>
			<el-table-column prop="description" label="详情" sortable>
			</el-table-column>
			<el-table-column label="操作" min-width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="page" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--新增/编辑界面-->
		<el-dialog @close="clearForm" :title="title" :visible.sync="formVisible" :close-on-click-modal="false">
			<el-form :model="brand" label-width="80px" :rules="brandRules" ref="brand">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="brand.name" placeholder="请输入品牌名称"></el-input>
                </el-form-item>
                <el-form-item label="英文名" prop="englishName">
                    <el-input v-model="brand.englishName" placeholder="请输入英文名称"></el-input>
                </el-form-item>
                <el-form-item label="序号" prop="sortIndex">
                    <el-input v-model="brand.sortIndex" placeholder="请输入序号"></el-input>
                </el-form-item>
				<el-form-item label="logo">
					<el-upload
							class="upload-demo"
							action="http://localhost:9527/services/common/file/upload"
							:before-remove="handleLogoRemove"
							:file-list="logoList"
							list-type="picture"
							:limit="1"
							:on-success="handleUploadSeccess"
							:on-exceed="handleOutOfRange">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="商品类型">
					<el-cascader v-model="selectedOptions" :show-all-levels="false" :props="props" :options="productTypes" change-on-select ></el-cascader>
				</el-form-item>
                <el-form-item label="详情">
                    <el-input type="textarea" v-model="brand.description" placeholder="请输入详情"></el-input>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleClose">取消</el-button>
				<el-button type="primary" @click.native="handleSubmit" :loading="brandLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
	export default {
		data() {
			return {
				filters: {
					keyword: ''
				},
                title: "新增",
				brands: [],
				total: 0,
				page: 1,
				size: 10,
				//logo
                logoList: [],
				listLoading: false,
				sels: [],//列表选中列
                productTypes: [],	//品牌类型
                props: {
					value: "id",
				    label: "name",
					children: "children"
				},
                selectedOptions:[],
				formVisible: false,
                brandLoading: false,
                brandRules: {
                    name: { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    englishName: { required: true, message: '请输入英文名称', trigger: 'blur' },
                    sortIndex: { required: true, message: '请输入序号', trigger: 'blur' },
                },
				//编辑界面数据
                brand: {
				    id: "",
                    name: '',
                    englishName: "",
                    sortIndex: "",
                    description: "",
                    productTypeId: "",
                    logo: ""
				},
			}
		},
		methods: {
            //文件超出个数
            handleOutOfRange(){
                this.$message({
                    message: '只能上传一张图片',
                    type: 'warning'
                });
            },
            //文件上传成功钩子函数
            handleUploadSeccess(response){
                this.brand.logo = response.data;
            },
		    //直接点删除键
            handleLogoRemove(file, fileList){
                this.removeLogo(file.response.data);
			},
            //从fastfds中删除上传的logo
            removeLogo(fileId){
                this.$http.get("/common/file/delete",{
                    params:{
                        fileId:fileId
					}
                }).then(res=>{
                    let data = res.data;
                    if (data.success){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    }else{
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                        return false;//阻止删除
					}
				});
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getBrands();
			},
			//获取用户列表
			getBrands() {
				let para = {
					page: this.page,
					size: this.size,
					keyword: this.filters.keyword
				};
				this.listLoading = true;
				this.$http.post("/product/brand/page",para).then((res)=>{
				    let data = res.data;
				    this.brands = data.rows;
				    this.total = data.total;
				});
				this.listLoading = false;
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					this.$http.delete("/product/brand/"+row.id).then((res)=>{
                        this.listLoading = false;
                        let data = res.data;
                        if (data.success){
							this.$message({
								message: data.message,
								type: 'success'
							});
						}else {
                            this.$message({
                                message: data.message,
                                type: 'error'
                            });
						}
                        this.getBrands();
					});
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
                this.title = "编辑";
				this.formVisible = true;
                this.loadProductTypes();
				this.brand = Object.assign({}, row);
				//当有logo的时候显示出来
				if(this.brand.logo){
					this.logoList = [{name: this.brand.name,url:"http://192.168.0.106"+this.brand.logo}];
				}
                this.loadProductType();
			},
			//显示新增界面
			handleAdd: function () {
			    this.title = "新增";
				this.formVisible = true;
				this.loadProductTypes();
			},
			//新增或修改
			handleSubmit: function () {
				this.$refs.brand.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//获取选中的类型的数组
							let ids = this.selectedOptions;
							//获取最后一个值
							this.brand.productTypeId = ids[ids.length-1];
							this.$http.post("/product/brand",this.brand).then((res)=>{
								let data = res.data;
								if (data.success){
                                    this.$message({
                                        message: data.message,
                                        type: 'success'
                                    });
								}else {
                                    this.$message({
                                        message: data.message,
                                        type: 'error'
                                    });
								}
							});
							this.brandLoading = false;
							this.formVisible = false;
							this.getBrands();
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				console.debug(ids)
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					this.$http.delete("/product/brand/"+ids).then((res)=>{
                        this.listLoading = false;
                        let data = res.data;
                        if (data.success){
                            this.$message({
                                message: data.message,
                                type: 'success'
                            });
                        }else {
                            this.$message({
                                message: data.message,
                                type: 'error'
                            });
                        }
                        this.getBrands();
                    });
				});
			},
            //高级查询
            handleSearch(){
			    this.page = 1;
			    this.getBrands();
			},
			//加载商品分类
			loadProductTypes(){
			    this.$http.get("/product/productType/tree").then((res)=>{
			        this.productTypes = this.loadTreeData(res.data);
				});
			},
			//解决级联选择最后一项为null的问题
			loadTreeData(data){
                for(var i=0;i<data.length;i++){
                    if(data[i].children.length<1){
                        // children若为空数组，则将children设为undefined
                        data[i].children=undefined;
                    }else {
                        // children若不为空数组，则继续 递归调用 本方法
                        this.loadTreeData(data[i].children);
                    }
                }
                return data;
			},
			//商品分类回填
			loadProductType(){
                this.$http.get("/product/productType/ids/"+this.brand.productTypeId).then((res)=>{
                    this.selectedOptions = res.data;
                });
			},
            handleClose(){
                this.formVisible = false;
                this.clearForm();
			},
			clearForm(){
                this.brand = {
                    id:"",
                    name: '',
                    englishName: "",
                    sortIndex: "",
                    description: "",
                    productTypeId: "",
                    logo: ""
                };
                this.logoList = [];
                this.selectedOptions = [];
			}
		},
		mounted() {
			this.getBrands();
		}
	}

</script>

<style scoped>

</style>