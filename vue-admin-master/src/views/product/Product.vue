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
				<el-form-item>
					<el-button type="primary" @click="handleView">显示属性</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleSku">SKU属性</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">上架</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">下架</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="products" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="标题" sortable>
			</el-table-column>
			<el-table-column prop="subName" label="副标题" sortable>
			</el-table-column>
			<el-table-column prop="productType.name" width="80px" label="商品类型">
			</el-table-column>
			<el-table-column prop="brand.name" label="商品品牌" width="80px">
			</el-table-column>
			<el-table-column prop="onSaleTime" width="100px" :formatter="formatOnSaleTime" label="上架时间" sortable>
			</el-table-column>
			<el-table-column prop="offSaleTime" width="100px" :formatter="formatOffSaleTime" label="下架时间" sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="100px" sortable>
				<template scope="scope">
					<span v-if="scope.row.state==0" style="color: gray">下架</span>
					<span v-else style="color: red">上架</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150px">
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
			<el-form :model="product" label-width="80px" :rules="productRules" ref="product">
                <el-form-item label="标题" prop="name">
                    <el-input v-model="product.name" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="副标题" prop="subName">
                    <el-input v-model="product.subName" placeholder="请输入副标题"></el-input>
                </el-form-item>
				<el-form-item label="商品类型">
					<el-cascader v-model="selectedOptions" style="width: 100%" :show-all-levels="false" :props="props" :options="productTypes" change-on-select ></el-cascader>
				</el-form-item>
				<el-form-item label="商品品牌">
					<!--<el-input v-model="product.brandId"></el-input>-->
					<el-select size="small"
							   clearable
							   v-model="product.brandId"
							   filterable
							   remote
							   reserve-keyword
							   placeholder="请输入品牌名称"
							   :remote-method="remoteLoadBrands">
						<el-option
								v-for="brand in brands"
								:key="brand.id"
								:label="brand.name"
								:value="brand.id">
							<span style="float: left">{{brand.name}}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ brand.englishName }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="媒体属性">
					<el-upload
							class="upload-demo"
							action="http://localhost:9527/services/common/file/upload"
							:before-remove="handleLogoRemove"
							:file-list="mediaList"
							list-type="picture"
							:on-success="handleUploadSeccess">
						<el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
				</el-form-item>
                <el-form-item label="商品描述">
                    <el-input type="textarea" v-model="product.description" placeholder="请输入详情"></el-input>
                </el-form-item>
                <el-form-item label="商品详情">
					<!--<quill-editor-->
							<!--v-model="product.content"-->
							<!--ref="myQuillEditor"-->
							<!--:options="editorOption">-->
					<!--</quill-editor>-->
					<SquillEditorFastdfs host="http://192.168.43.181" v-model="product.content" uploadUrl='http://localhost:9527/services/common/file/upload'></SquillEditorFastdfs>
                </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleClose">取消</el-button>
				<el-button type="primary" @click.native="handleSubmit" :loading="productLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新显示属性界面-->
		<el-dialog title="显示属性管理" :visible.sync="viewVisible" :close-on-click-modal="false">
			<el-card class="box-card">
				<div style="margin-bottom: 20px" v-for="viewPropertie in viewProperties" class="text item">
					<el-input v-model="viewPropertie.value">
						<template slot="prepend">{{viewPropertie.specName}}：</template>
					</el-input>
					<!--<div style="height: 20px"></div>-->
				</div>
			</el-card>
			<span slot="footer" class="dialog-footer">
                <el-button @click="viewVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitView">确 定</el-button>
          	</span>
		</el-dialog>

		<!--新SKU属性界面-->
		<el-dialog title="SKU属性管理" :visible.sync="skuVisible" :close-on-click-modal="false" width="60%">
			<el-card class="box-card">
				<div style="margin-bottom: 20px" v-for="skuProperty in skuProperties" class="text item">
					<div slot="header" class="clearfix">
						<span>{{skuProperty.specName}}</span>
					</div>
					<div style="margin-left: 20px" v-for="index in skuProperty.options.length+1" :key="index" class="text item">
						<el-input v-model="skuProperty.options[index-1]" style="width:80%"></el-input>
						<el-button icon="el-icon-delete" @click="skuProperty.options.splice(index-1,1)" style="width:10%"></el-button>
					</div>
				</div>
			</el-card>
			<el-table :data="skus" border style="width: 100%">
				<el-table-column type="index" width="50"></el-table-column>
				<template v-for="(value,key) in skus[0]">
					<!--更改价格和库存单元格和标题-->
					<el-table-column v-if="key=='price'" :prop="key" label="价格">
						<template scope="scope">
							<el-input v-model="scope.row.price"></el-input>
						</template>
					</el-table-column>
					<el-table-column v-else-if="key=='availableStock'" :prop="key" label="库存">
						<template scope="scope">
							<el-input v-model="scope.row.availableStock"></el-input>
						</template>
					</el-table-column>
					<!--隐藏sku_index属性-->
					<el-table-column v-else-if="key!='sku_index'" :prop="key" :label="key">
					</el-table-column>
				</template>
			</el-table>
			<span slot="footer" class="dialog-footer">
                <el-button @click="skuVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSubmitSku">确 定</el-button>
          	</span>
		</el-dialog>
	</section>
</template>

<script>
    import SquillEditorFastdfs from '@/components/SquillEditorFastdfs.vue';
	export default {
        components:{
            SquillEditorFastdfs //富文本框上传组件
        },
		data() {
			return {
			    temSkus: [],
			    skus:[],
                skuProperties: [],
                skuVisible: false,
                viewProperties: [],
                viewVisible: false,
                brands:[],
                editorOption:{},
				filters: {
					keyword: ''
				},
                selectedOptions:[],
                title: "新增",
				products: [],
				total: 0,
				page: 1,
				size: 10,
                mediaList: [],
				listLoading: false,
				sels: [],//列表选中列
                productTypes: [],	//品牌类型
                props: {
					value: "id",
				    label: "name",
					children: "children"
				},
				formVisible: false,
                productLoading: false,
                productRules: {
                    name: { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    englishName: { required: true, message: '请输入英文名称', trigger: 'blur' },
                    sortIndex: { required: true, message: '请输入序号', trigger: 'blur' },
                },
				//编辑界面数据
                product: {
				    id: "",
                    name: '',
                    subName: "",
                    productTypeId: "",
                    brandId: "",
                    description: "",
                    content: "",
                    mediasArr: [],
				},
			}
		},
		methods: {
            handleSubmitSku(){
                let param = {};
                param.skuProperties = this.skuProperties;
                param.productId = this.sels[0].id;
                param.skus = this.skus;
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.$http.post("/product/product/skuProperties",param).then(res=>{
                        let data = res.data;
                        if (data.success){
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message: '保存成功',
                                type: 'error'
                            });
                        }
                    });
                    this.skuVisible = false;
				});
			},
            loadSkuProperties(){
                this.$http.get("/product/product/skuProperties/"+this.sels[0].id).then(res=>{
                    let data = res.data;
                    this.skuProperties = data.skuProperties;
					this.temSkus = data.skus;
                });
			},
            //sku属性单击事件
            handleSku(){
                if(this.sels.length!=1){
                    this.$message({
                        message: '请只选择一件商品',
                        type: 'warning'
                    });
                    return;
                }
                this.loadSkuProperties();
                this.skuVisible = true;
			},
            //提交view
            handleSubmitView(){
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
					//准备参数
					let param = {};
					param.viewProperties = this.viewProperties;
					param.productId = this.sels[0].id;
					this.$http.post("/product/product/viewProperties",param).then(res=>{
                        let data = res.data;
                        if (data.success){
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message: '保存成功',
                                type: 'error'
                            });
                        }
					});
					this.viewVisible = false;
				});
			},
            //加载显示属性
            loadViewProperties(){
                this.$http.get("/product/product/viewProperties/"+this.sels[0].id).then(res=>{
                    this.viewProperties = res.data;
				});
			},
            //显示属性单击事件
            handleView(){
                if(this.sels.length!=1){
                    this.$message({
                        message: '请只选择一件商品',
                        type: 'warning'
                    });
                    return;
				}
                this.loadViewProperties();
                this.viewVisible = true;
			},
            loadBrands(){
                this.$http.get("/product/brand/list").then(res=>{
                    this.brands = res.data;
				});
			},
            //远程加载品牌
            remoteLoadBrands(query) {
                if (query !== '') {
                    this.$http.post("/product/brand/page",{
						keyword:query
                    }).then((res)=>{
                        this.brands = res.data.rows;
                    });
                } else {
                    this.brands = [];
                }
            },
            //通过商品id查询Ext
            loadProductExt(id){
                this.$http.get("/product/product/ext/"+id).then(res=>{
                    let data = res.data;
                    //medias	["/group1/M00/00/02/wKgrtVzjLWOAFk9mAAA3w70uYio146.jpg","/group1/M00/00/02/wKgrtVzjLWWAX6kYAAB-x_KgBFg193.jpg"]
					let medias = JSON.parse(data.medias);
                    for(let i=0;i<medias.length;i++){
                    	let str = "http://192.168.43.181";
                        str += medias[i];
                        str += ""
                    	this.mediaList.push({url:str});
					}
                    this.product = data;
				});
			},
		    //时间格式化
            formatDate(time){
				let date = new Date(time);
				let year = date.getFullYear();
				let mouth = date.getMonth()+1;//月份是从0开始的
				let day = date.getDate();
				let hour = date.getHours();
				let minute = date.getMinutes()
				let second = date.getSeconds();
				return year+"-"+this.dateFormat(mouth)+"-"+this.dateFormat(day)+" "+this.dateFormat(hour)+":"+this.dateFormat(minute)+":"+this.dateFormat(second);
			},
			//格式化个位数的，加一个0
			dateFormat(time){
                return time<10?"0"+time:time;
			},
			formatOnSaleTime(row, column){
                return this.formatDate(row.onSaleTime);
			},
			formatOffSaleTime(row, column){
                return this.formatDate(row.offSaleTime);
			},
            //文件上传成功钩子函数
            handleUploadSeccess(response){
                this.product.mediasArr.push(response.data);
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
				this.getProducts();
			},
			//获取用户列表
			getProducts() {
				let para = {
					page: this.page,
					size: this.size,
					keyword: this.filters.keyword
				};
				this.listLoading = true;
				this.$http.post("/product/product/page",para).then((res)=>{
				    let data = res.data;
				    this.products = data.rows;
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
					this.$http.delete("/product/product/"+row.id).then((res)=>{
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
                        this.getProducts();
					});
				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
                this.title = "编辑";
				this.formVisible = true;
                this.loadProductTypes();
				this.product = Object.assign({}, row);
				this.selectedOptions = [];
				this.loadProductExt(row.id);
                this.loadProductType();
                this.loadBrands();
			},
			//显示新增界面
			handleAdd: function () {
			    this.title = "新增";
				this.formVisible = true;
				this.loadProductTypes();
			},
			//新增或修改
			handleSubmit: function () {
				this.$refs.product.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//获取选中的类型的数组
							let ids = this.selectedOptions;
							//获取最后一个值
							this.product.productTypeId = ids[ids.length-1];
							this.product.medias = this.arrToString(this.product.mediasArr);
							this.$http.post("/product/product",this.product).then((res)=>{
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
							this.productLoading = false;
							this.formVisible = false;
							this.getProducts();
						});
					}
				});
			},
			//数组转为String
            arrToString(arr){
                let str = "[";
                for(let i=0;i<arr.length;i++){
                    str += "\""+arr[i]+"\"";
                    if(i!=arr.length-1){
                        str += ",";
					}
				}
				str += "]";
                return str;
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					this.$http.delete("/product/product/"+ids).then((res)=>{
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
                        this.getProducts();
                    });
				});
			},
            //高级查询
            handleSearch(){
			    this.page = 1;
			    this.getProducts();
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
                this.$http.get("/product/productType/ids/"+this.product.productTypeId).then((res)=>{
                    this.selectedOptions = res.data;
                });
			},
            handleClose(){
                this.formVisible = false;
                this.clearForm();
			},
			clearForm(){
                this.product = {
                    id: "",
                    name: '',
                    subName: "",
                    productTypeId: "",
                    brandId: "",
                    description: "",
                    content: "",
                    mediasArr: [],
                };
                this.content = '';
                this.mediaList = [];
                this.selectedOptions = [];
                SquillEditorFastdfs.content = "";
			},
		},
		mounted() {
			this.getProducts();
		},
		watch:{
            skuProperties:{//深度监听，可监听到对象、数组的变化
                handler(val, oldVal){
                    let res = this.skuProperties.reduce((pre,curr)=>{
					    let result = [];
					    pre.forEach(e1=>{
                            e1.sku_index = (e1.sku_index||'')+"_";
					        for(let i=0;i<curr.options.length;i++){
								let e2 = curr.options[i];
                                let temp = {}
                                Object.assign(temp,e1);
                                temp[curr.specName] = e2;
                                temp.sku_index += i;
                                result.push(temp);
							}
						});
					    return result;
					},[{}]);
                    //添加价格
                    res.forEach(e1=>{
                        e1.price = 0;
                        e1.availableStock = 0;
                        e1.sku_index = e1.sku_index.substring(1);
                    })
                    this.skus = res;
                    if(this.temSkus){
                        for(let i=0;i<this.temSkus.length;i++){
                            this.skus[i].price = this.temSkus[i].price;
                            this.skus[i].availableStock = this.temSkus[i].availableStock;
                        }
					}
                },
                deep:true
            }
		}
	}

</script>

<style scoped>

</style>