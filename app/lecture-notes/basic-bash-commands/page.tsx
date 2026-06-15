import PythonBlock from '../ui/pythonblock'
import SyntaxBlock from '../ui/syntaxblock'
import ShellBlock from '../ui/shellblock'
import Image from '../ui/image'
import Code from '../ui/code'
import It from '../ui/italic'
import Bold from '../ui/bold'
import Ul from '../ui/underline'
import Term from '../ui/term'
import Link from '../ui/link'
import SectionHeading from '../ui/sectionheading'
import P from '../ui/paragraph'
import Emdash from '../ui/emdash'
import Itemize from '../ui/itemize'
import Enumerate from '../ui/enumerate'
import Item from '../ui/item'

import { inter } from '@/app/ui/fonts'
import { lusitana } from '@/app/ui/fonts'
import { garamond } from '@/app/ui/fonts'

import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

// @ts-ignore
import sourcesConfig from '../sources.yaml'
import TitleBlock from '../ui/titleblock'

let sourcesByPathName: {[key: string]: { pageTitle: string, namedIdentifier: string }} = {}
let sourcesByNamedIdentifier: {[key: string]: { pathName: string, pageTitle: string }} = {}
for (let page of sourcesConfig.pages) {
  sourcesByPathName[page.pathName] = {
    pageTitle: page.pageTitle,
    namedIdentifier: page.namedIdentifier
  }
  sourcesByNamedIdentifier[page.namedIdentifier] = {
    pathName: page.pathName,
    pageTitle: page.pageTitle
  }
}


let PATH_NAME = (() => {
  const filename = fileURLToPath(import.meta.url);
  return path.basename(path.dirname(filename))
})()

let PARENT_PATH = (() => {
  const filename = fileURLToPath(import.meta.url);
  return `/${path.dirname(path.dirname(filename)).split("app/")[1]}`
})()

export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateMetadata({ params } : { params: Promise<any> }) {
  return {
    title: sourcesByPathName[PATH_NAME].pageTitle
  }
}

async function LectureNotes({ allPathData }: { allPathData: any }) {
  return (
    <>
      <P>The engineering servers run a Debian-based Linux distribution, so once you're logged into the engineering servers, you can proceed to execute any shell commands that work in your default Linux shell. We'll be using the <Term>Bourne Again Shell (Bash)</Term>, but most of the shell commands that we'll be using are actually system-installed programs that are standard on every Linux system and work with all Linux shells. Still, for consistency, if you haven't already, you should configure your user account on the engineering servers to use Bash by default. You can do this via <Link href="https://teach.engr.oregonstate.edu/teach.php?type=want_auth">TEACH</Link>.</P>

      <P>A shell can be thought of as an advanced, text-based version of a file explorer. When you open up the Windows file explorer or Mac Finder (etc), you're presented with a bunch of files and folders. When you click (or double-click) on a file, it opens that file in the default application configured for that kind of file. When you click (or double-click) on a folder, it navigates into that folder so that you can see the other files and folders contained inside it.</P>

      <P>A shell is very similar, except it's text-based, meaning that there are no icons to click on<Emdash/>there's only text, which is displayed when you execute certain shell commands. At any given point in time, your shell is operating inside a certain folder. Folders are often referred to as <Term>directories</Term>, and the folder (directory) that your shell is currently operating inside is referred to as the <Term>working directory</Term>. To display the contents of your working directory (i.e., to see the files and folders contained inside your current folder), execute the <Code>ls</Code> shell command. For example, this is what it looks like when I execute <Code>ls</Code> immediately after logging into the engineering servers:</P>

      <ShellBlock copyable={false}>{
`(base) guyera@flip1:~$ ls
bin      instructor  perl5        sc2_rl_code.tar.gz     Windows.Documents
envs     lib         public_html  share
guille   miniconda3  samples      tamarisk-gen-code.tgz
include  openssl     saves        trash
`
      }</ShellBlock>

      <P>On Unix-like systems (which includes Linux and therefore the engineering servers), any file whose name starts with a <Code>.</Code> is said to be a <Term>hidden file</Term>. By default, <Code>ls</Code> will only show you <Ul>non-hidden</Ul> files. To see hidden files, execute <Code>ls -a</Code>:</P>

      <ShellBlock copyable={false}>{
`(base) guyera@flip4:~$ ls -a
.              .esd_auth   .logout             .ssh
..             .forward    .mailrc             .systemtap
.bash_history  .ghc        .matplotlib         tamarisk-gen-code.tgz
.bash_profile  .gitconfig  miniconda3          .tcshrc
.bashrc        .gsutil     .mongorc.js         test.txt
.bashrc.bak.0  guille      .netrc              .tmux.conf
.bashrc-conda  .history    .node_repl_history  trash
bin            .idlerc     .npm                .vim
.cache         include     .nv                 .viminfo
.ccache        instructor  openssl             .vimrc
.conda         .ipython    perl5               .wget-hsts
.config        .jupyter    .pki                Windows.Documents
.cshrc         .keras      public_html         .Xauthority
.cshrc.bak.0   .lesshst    .python_history     .xonshrc
.dbshell       lib         samples             .zshrc
.emacs.d       .lmod.d     saves
.env           .local      sc2_rl_code.tar.gz
envs           .login      share
`
      }</ShellBlock>

      <P>To see what your current working directory is, execute the <Code>pwd</Code> shell command:</P>

      <ShellBlock copyable={false}>{
`(base) guyera@flip1:~$ pwd
/nfs/stak/users/guyera`
      }</ShellBlock>
      
      <P>My working directory is currently <Code>/nfs/stak/users/guyera</Code>. Indeed, when you first log into the engineering servers, your working directory will be your <Term>home directory</Term> by default. My home directory is <Code>/nfs/stak/users/guyera</Code>. Every user has their own home directory. Yours will be similar, except my ONID will be replaced with yours.</P>

      <P><Code>/nfs/stak/users/guyera</Code> is referred to as an <Term>absolute path</Term>. Absolute paths are one of two kinds of <Term>file paths</Term>. File paths specify the location of a file or directory within a file system. Absolute paths start with a <Code>/</Code>, and they specify the <It>entire</It> location of the file or directory relative to the "top", or "root", of the file system. That's to say, <Code>/nfs/stak/users/guyera</Code> refers to a directory named <Code>guyera</Code>, which is inside another directory named <Code>users</Code>, which is inside another directory named <Code>stak</Code>, which is inside another directory named <Code>nfs</Code>, which is inside the root directory (i.e., the "top-level" directory) of the entire file system (the root directory doesn't really have a name, but you can think of it as being named <Code>/</Code> if that makes sense to you).</P>

      <P>Of course, there are shell commands that allow you to change your working directory (i.e., navigate the file system). But before we can do that, let's first <It>create</It> a new directory to navigate into. You can do this with the <Code>mkdir</Code> shell command. This command is slightly more complicated than <Code>ls</Code> or <Code>pwd</Code> in that you must provide it a <Term>command-line argument</Term>. Command-line arguments are simply additional inputs to shell commands. To provide command-line arguments to a shell command, simply type them out after the name of the command itself, separated by spaces, before pressing the enter key to execute the command. In the case of <Code>mkdir</Code>, we must provide a single command-line argument specifying the path of the directory that we want to create. Let's create a directory named <Code>cs162</Code> inside our home directory. Execute the following command, replacing my ONID with yours:</P>

      <ShellBlock>{
`mkdir /nfs/stak/users/guyera/cs162`
      }</ShellBlock>

      <P>The above command creates a directory named <Code>cs162</Code> inside the directory named <Code>guyera</Code> (my home directory), which is inside the directory named <Code>users</Code>, and so on. If you execute <Code>ls</Code> again, you should be able to see the newly created <Code>cs162</Code> directory: </P>


      <ShellBlock copyable={false}>{
`(base) guyera@flip1:~$ ls
bin     include     openssl      saves                  trash
cs162   instructor  perl5        sc2_rl_code.tar.gz     Windows.Documents
envs    lib         public_html  share
guille  miniconda3  samples      tamarisk-gen-code.tgz
`
      }</ShellBlock>

      <P>Before we move on, I should tell you about <Term>relative paths</Term>. I said that absolute paths are one of two kinds of file paths. Relative paths are the other kind. A relative path is any file path that does <Ul>not</Ul> start with a <Code>/</Code>, and it specifies the location of a file or directory relative to your current working directory. For example, <Code>/nfs</Code> is an absolute path (it starts with a <Code>/</Code>), and it specifies a file or directory named <Code>nfs</Code>, which is inside the root directory of the file system. In contrast, <Code>nfs</Code> (without the <Code>/</Code> at the beginning) is a relative path, and it specifies a file or directory named <Code>nfs</Code>, which is inside <It>your current working directory</It>. In most contexts where you need to specify a file path, you can specify either an absolute path <It>or</It> a relative path. For example, when we executed the previous shell command to create the <Code>cs162</Code> directory inside our working directory, we could have instead specified a relative path, and it would have done the exact same thing. In that particular case, a relative path would have been much easier to type out. It would've looked like this:</P>

      <ShellBlock>{
`mkdir cs162`
      }</ShellBlock>

      <P>Okay, let's move on. Suppose you want to change your working directory. In other words, you want to move from one directory to another. In a file explorer, you'd usually do this by clicking (or double-clicking) on the folder that you want to navigate into. But again, terminals and shells are text-based interfaces; barring certain exceptions, the mouse is mostly useless in a terminal, and there aren't even any folder icons to click on to begin with. Instead, you must use another shell command: <Code>cd</Code>. The <Code>cd</Code> command also accepts a single command-line argument, specifying the path of the directory that you want to navigate into (which will then become your working directory). This path can either be an absolute path or a relative path. Let's navigate into the <Code>cs162</Code> directory that we created previously. It's inside our home directory, which is also our current working directory, so let's use a relative path:</P>

      <ShellBlock>{
`cd cs162`
      }</ShellBlock>

      <P>To prove that it worked, execute <Code>pwd</Code> again, and you'll see that your working directory has changed:</P>

      <ShellBlock copyable={false}>{
`(base) guyera@flip1:cs162$ pwd
/nfs/stak/users/guyera/cs162`
      }</ShellBlock>

      <P>Since we're creating directories, let's create some more to help you organize your work for this class. Inside your <Code>cs162</Code> directory (which is currently your working directory), create an <Code>assignments</Code> directory and a <Code>labs</Code> directory:</P>

      <ShellBlock>{
`mkdir assignments
mkdir labs`
      }</ShellBlock>

      <P>For the sake of demonstration, navigate into your newly created <Code>assignments</Code> directory:</P>
      
      <ShellBlock>{
`cd assignments`
      }</ShellBlock>

      <P>We're now inside our <Code>assignments</Code> directory, which is inside our <Code>cs162</Code> directory. Suppose we want to navigate back "up" into our <Code>cs162</Code> directory. To do that, simply execute <Code>cd</Code> with <Code>..</Code> as the command-line argument:</P>

      <ShellBlock>{
`cd ..`
      }</ShellBlock>

      <P><Code>..</Code> is a special alias, or "nickname", for a given directory's <Term>parent</Term>. The parent of a directory is simply the directory that contains it. Hence, <Code>..</Code> can be thought of as a relative path that specifies the parent directory of the current working directory (i.e., the directory that contains the current working directory). Our working directory was the <Code>assignments</Code> directory, and its parent is <Code>cs162</Code>, so <Code>cd ..</Code> navigated us "up" into the <Code>cs162</Code> directory.</P>

      <P>Just as <Code>..</Code> is an alias for a given directory's parent, <Code>.</Code> (just a single period) is an alias for a directory itself. Hence, by itself, <Code>.</Code> can be thought of as a relative path that simply specifies the current working directory. This is helpful when you want to specify the current working directory as a command-line argument to a shell command. You may see some examples of this later when we discuss more advanced shell commands.</P>

      <P>There's another way to use the <Code>cd</Code> command: if you execute it without specifying any command-line arguments, it will automatically navigate you all the way back to your home directory (in my case, <Code>/nfs/stak/users/guyera</Code>), regardless of what your current working directory is. In other words, to get back to your home directory at any time, simply execute:</P>

      <ShellBlock>{
`cd`
      }</ShellBlock>

      <SectionHeading>Other shell commands</SectionHeading>

      <P>You now know how to organize and navigate your file space on the engineering servers using <Code>pwd</Code>, <Code>ls</Code>, <Code>cd</Code>, and <Code>mkdir</Code>, but terminals and shells are capable of a lot more than that. Below are some other shell commands that you might find useful every now and then.</P>

      <Itemize>
        <Item><P><Code>rm</Code>: used to remove (delete) files. Provide a single command-line argument specifying the path to the file you want to remove. For example, the following shell command would delete the file called <Code>hello.txt</Code> that's currently in your working directory (assuming such a file exists):</P>

        <ShellBlock>rm hello.txt</ShellBlock></Item>

        <Item><P><Code>rm -r</Code>: used to remove (delete) directories, including everything inside them. It's technically the same command as the previous one, but with an additional <Code>-r</Code> command-line argument. This is a special command-line argument known as a <Term>flag</Term>. Flags simply enable special capabilities of shell commands that would otherwise be disabled. By default, <Code>rm</Code> is not capable of removing entire directories. But when the <Code>-r</Code> flag is provided, it can. For example, the following shell command would delete the directory called <Code>images</Code> that's currently in your working directory (assuming the <Code>images</Code> directory exists):</P>

        <ShellBlock>rm -r images</ShellBlock></Item>

        <Item><P><Code>cp</Code>: used to create copies of files. Provide <Ul>two</Ul> command-line arguments: the path of the existing file that you want to create a copy of, and the path that you want the new copy to have. For example, the following shell command would copy the file called <Code>hello.txt</Code> that's currently in your working directory, and the copy would be called <Code>goodbye.txt</Code> (also in your working directory):</P>

        <ShellBlock>cp hello.txt goodbye.txt</ShellBlock></Item>
        
        <Item><P><Code>cp -r</Code>: used to create copies of entire directories, including everything inside them. It works exactly like <Code>cp</Code>. The <Code>-r</Code> flag simply enables copying directories. For example, the below shell command would copy the directory called <Code>images</Code> that's currently in your working directory, and the copy would be called <Code>backup</Code> (also in your working directory). The contents of the two directories would be identical<Emdash/>all of the files and directories within the <Code>images</Code> directory are copied along with it.</P>

        <ShellBlock>cp -r images pictures</ShellBlock></Item>

        <Item><P><Code>cat</Code>: used to display the contents of a file in the terminal. Provide a single command-line argument, specifying the path of the file whose contents you want to display. For example, the following shell command would display the contents of the file called <Code>hello.txt</Code> in your working directory (assuming such a file exists):</P>

        <ShellBlock>cat hello.txt</ShellBlock></Item>

        <Item><P><Code>cat</Code> can also be used to concatenate two or more files' contents together into a single string of text (this was actually its original purpose), but it's mostly just used to display file contents in the terminal. It will be more useful once we've discussed <Link href={`${PARENT_PATH}/${allPathData["terminal-based-text-editing"].pathName}`}>terminal-based text-editing</Link>.</P></Item>
      </Itemize>

      <SectionHeading>Other terminal tricks</SectionHeading>

      <P>Being able to use a terminal and shell efficiently will make your life a lot easier. Here are some simple tricks to speed things up.</P>
      
      <Itemize>
        <Item><P>Pressing the up arrow on your keyboard will iterate backward through your history of recently executed shell commands (and pressing the down arrow will iterate forward through it). For example, at any given time, simply pressing the up arrow followed by the enter key will usually re-execute whatever shell command you executed most recently.</P></Item>
      
        <Item><P>Typing an exclamation point followed by a few characters and pressing enter will re-execute whatever command you most recently executed starting with those characters. For example, if you recently executed <Code>cat coolfile.txt</Code>, then typing <Code>!ca</Code> and pressing enter will re-execute that same command (assuming you haven't executed any other commands starting with <Code>ca</Code> even more recently).</P></Item>

        <Item><P>The <Code>history</Code> command (which accepts no command-line arguments) prints your history of recent shell commands.</P></Item>

        <Item><P>When typing out a file path as a command-line argument to a shell command, you can press the tab key to autocomplete parts of the path. For example, if you're trying to remove the file called <Code>long-file-name-that-nobody-wants-to-type.txt</Code> (e.g., with the <Code>rm</Code> shell command), rather than typing out the entire file name, you can just type out the first couple of letters and press the tab key. Your terminal will autocomplete as much as it can. If you press the tab key and find that it only autocompletes part of the file name, one possible reason is that you simply mistyped the first few characters, but the other possibility is that there are multiple files in the directory that starts with the same few characters. In the latter case, pressing the tab key will only autocomplete up until the point where the two file names differ. At that point, pressing the tab key <Ul>twice</Ul> in rapid succession will print out the names of all of the files starting with those characters.</P></Item>

        <Item><P>Holding <Code>Ctrl</Code> and pressing <Code>C</Code> will terminate (immediately end) whatever command is currently executing. However, it can also be used to effectively cancel whatever command you have typed out so far. For example, suppose you start typing out a really long command only to realize that you made a mistake at the very beginning of it, or perhaps you change your mind and decide that you don't want to execute the command at all. In either case, you can simply hold <Code>Ctrl</Code> and press <Code>C</Code>, and it will cancel everything that you've typed so far.</P></Item>

      </Itemize>
    </>
  )
}

export default async function Page({ params }: any) {
  return (
    <>
      <div className={`w-[55rem] max-w-[100%] mx-auto pt-20 pb-20 px-4 ${inter.className} text-[1.25rem] leading-9`}>
        <TitleBlock title={sourcesByPathName[PATH_NAME].pageTitle} author="Alex Guyer" email="guyera@oregonstate.edu"/>
        <LectureNotes allPathData={sourcesByNamedIdentifier}/>
      </div>
    </>
  )
}
