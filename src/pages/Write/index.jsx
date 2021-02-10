import React, {Component,Fragment} from 'react';
import { Form, Input, Button,message,Select } from 'antd';
import qs from 'querystring'
import axios from "axios";

const {Option}=Select
const layout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 18,
    },
};
class Write extends Component {
    componentDidMount() {
        const {search} = this.props.location
        const {publish_user} = qs.parse(search.slice(1))
        this.formRef.setFieldsValue({
            publish_user:publish_user
        })
    }

    render() {
        const onFinish = (values) => {
            const key = 'write'
            message.loading({ content: '上传中...',key})
            console.log(values);
            axios.post("https://qcotvg.fn.thelarkcloud.com/writeArticle",values).then(
                response=>{
                    console.log(response)
                    if (response.data.tip==='success')
                        message.success({content:'上传成功！',key,duration:2})
                    else
                        message.error({content:'上传失败，请重试！',key,duration:2})
                },
                error=>{console.log(error)}
            )
        };
        return (
            <Fragment>
                <Form {...layout}  name="nest-messages" onFinish={onFinish} ref={c=>{this.formRef=c}}>
                    <Form.Item name="article_title" label="文章标题" rules={[{required: true,min:5,max:30,type:"string",message:"请输入文章标题！"}]}>
                        <Input placeholder="请输入文章标题（5-30个字）"/>
                    </Form.Item>
                    <Form.Item name="publish_user"  label="发布主体" rules={[{required: true}]}>
                        <Input disabled={true}/>
                    </Form.Item>
                    <Form.Item name="article_content" label="文章内容" rules={[{required:true,message:"请输入文章内容！"}]}>
                        <Input.TextArea placeholder="请输入正文" autoSize={{ minRows: 15, maxRows: 15 }}/>
                    </Form.Item>
                    <Form.Item label="文章类别" name="article_type" rules={[{required: true,message:'请选择文章类别'},]} initialValue="科技">
                        <Select style={{ width: 120 }}>
                            <Option value="科技">科技</Option>
                            <Option value="娱乐">娱乐</Option>
                            <Option value="游戏">游戏</Option>
                            <Option value="体育">体育</Option>
                            <Option value="财经">财经</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
                        <Button type="primary" htmlType="submit">
                            发布
                        </Button>
                    </Form.Item>
                </Form>
            </Fragment>
        );
    }
}

export default Write;