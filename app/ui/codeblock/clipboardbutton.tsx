"use client";

import React from 'react'
import { useState } from 'react'
import Image from 'next/image';

import clipboardIcon from './icons/clipboard.svg'
import checkIcon from './icons/check.svg'

type Props = { textToCopy?: string, mouseOver: boolean }
type State = { clicked: boolean }

class ClipboardButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      clicked: false
    }
  }

  copyToClipboard = async () => {
    navigator.clipboard.writeText(this.props.textToCopy ? this.props.textToCopy : '')
    this.setState({ clicked: true })
    setTimeout(() => {this.setState({ clicked: false })}, 2000)
  }

  render() {
    return (
      <div className={`z-1 absolute right-0 top-0 w-[30%] aspect-square max-h-[calc(100%-1.5em)] mr-3 mt-3 pointer-events-none`}>
        <div className="absolute right-0 top-0 h-full aspect-square pointer-events-none">
          <div className={`absolute right-0 top-0 max-h-full max-w-full w-9 aspect-square bg-[#000000aa] hover:bg-[#444444aa] rounded-md pointer-events-auto cursor-pointer ${this.props.mouseOver ? "opacity-100" : "opacity-20"}`} onClick={this.copyToClipboard}>
	          <Image src={clipboardIcon} alt="" className={`absolute w-full h-full p-1.5 ${!this.state.clicked ? "block" : "hidden"}`}/>
	          <Image src={checkIcon} alt="" className={`absolute w-full h-full p-2 ${this.state.clicked ? "block" : "hidden"}`}/>
	        </div>
	      </div>
      </div>
    )
  }
}

export default ClipboardButton
