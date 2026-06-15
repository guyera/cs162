" Map \ followed by a space to \
inoremap <leader><Space> <leader>

" Map \-- followed by a space to an endash
imap <leader>--<Space> <Endash/>

" Map \--- followed by a space to an emdash
imap <leader>---<Space> <Emdash/>

" Map \i followed by a space to italics component
imap <leader>i<Space> <It></It>ODODODODOD

" Map \b followed by a space to bold component
imap <leader>b<Space> <Bold></Bold>ODODODODODODOD

" Map \u followed by a space to underline component
imap <leader>u<Space> <Ul></Ul>ODODODODOD

" Map \p followed by a space to paragraph component
imap <leader>p<Space> <P></P>ODODODOD

" Map \` followed by a space to Code component
imap <leader>`<Space> <Code></Code>ODODODODODODOD

" Map \img followed by a space to Image component
imap <leader>img<Space> <Image src={} alt="TODO"/>ODODODODODODODODODODODODODOD

" Map \shell followed by a space to a copyable ShellBlock component
imap <leader>shell<Space> <ShellBlock>{<CR><CR>}</ShellBlock>OA``OD

" Map \\shell followed by a space to a non-copyable ShellBlock component
imap <leader><leader>shell<Space> <ShellBlock copyable={false}>{<CR><CR>}</ShellBlock>OA``OD

" Map \terminal followed by a space to a non-copyable TerminalBlock component
imap <leader>terminal<Space> <TerminalBlock copyable={false}>{<CR><CR>}</TerminalBlock>OA``OD

" Map \\terminal followed by a space to a copyable TerminalBlock component
imap <leader><leader>terminal<Space> <TerminalBlock>{<CR><CR>}</TerminalBlock>OA``OD

" Map \py followed by a space to a copyable PythonBlock component
imap <leader>py<Space> <PythonBlock>{<CR><CR>}</PythonBlock>OA``OD

" Map \\py followed by a space to a non-copyable PythonBlock component
imap <leader><leader>py<Space> <PythonBlock copyable={false}>{<CR><CR>}</PythonBlock>OA``OD

" Map \syntax followed by a space to a SyntaxBlock component
imap <leader>syntax<Space> <SyntaxBlock>{<CR><CR>}</SyntaxBlock>OA``OD

" Map \l followed by a space to an internal link
imap <leader>l<Space> <Link href={`${PARENT_PATH}/${allPathData[""].pathName}`}>TEXT</Link>ODODODODODODODODODODODODODODODODODODODODODODODODODOD

" Map \\l followed by a space to an external link
imap <leader><leader>l<Space> <Link href="">TEXT</Link>ODODODODODODODODODODODODOD

" Map \item followed by a space to item component
imap <leader>item<Space> <Item></Item>ODODODODODODOD

" Map \itemize followed by a space to an itemize component
imap <leader>itemize<Space> <Itemize><CR><Tab><CR></Itemize>OA<leader>item<Space>

" Map \enumerate followed by a space to an enumerate component
imap <leader>enumerate<Space> <Enumerate><CR><Tab><CR></Enumerate>OA<leader>item<Space>

" Map \sec followed by a space to a section heading
imap <leader>sec<Space> <SectionHeading id="">TODO</SectionHeading>ODODODODODODODODODODODODODODODODODODODODODODOD

" Map \term followed by a space to a term component
imap <leader>term<Space> <Term></Term>ODODODODODODOD

" Map \sln followed by a space to showLineNumbers={false}
imap <leader>sln<Space> showLineNumbers={false}

" Map \hl followed by a space to highlightLines="{}"
imap <leader>hl<Space> highlightLines="{}"<Left><Left>

" Map \fn followed by a space to fileName=""
imap <leader>fn<Space> fileName=""<Left>

" Map \todo followed by a space to {/*TODO*/}
imap <leader>todo<Space> {/*TODO*/}
