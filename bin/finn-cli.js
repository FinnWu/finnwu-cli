#! node

const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const fs = require('fs')
const handlebars = require('handlebars')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')

program.version('1.0.0', '-v, --version')
.command('init <name>')
.action((name) => {
	inquirer.prompt([
		{
			name: 'description',
			message: '请输入项目描述'
		},
		{
			name: 'author',
			message: '请输入作者名称'
		}
	]).then((answers) => {
		// 开始下载
		const spinner = ora('正在下载模板...');
		spinner.start();
		download('https://gitee.com:finnwu/webpack-config#master', name, {clone: true}, (err) => {
	    if(err) {
				spinner.fail()
				console.log(symbols.error, chalk.red('项目创建失败'))
	    }else {
	    	spinner.succeed()
	    }
	    const meta = {
	    	name,
	    	description: answers.description,
	    	author: answers.author
	    }
	    const fileName = `${name}/package.json`
	    const content = fs.readFileSync(fileName).toString()
	    const result = handlebars.compile(content)(meta)
	    fs.writeFileSync(fileName, result)

	    console.log(symbols.success, chalk.green('项目创建成功'))
	  })
		
	})
})
program.parse(process.argv);