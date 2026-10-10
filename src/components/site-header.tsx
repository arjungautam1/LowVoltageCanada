"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import { Brand } from "./brand";
import { CommunityLinks } from "./community-links";
import communityStyles from "./community-links.module.css";
import { storyKinds, topics } from "@/lib/types";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const searchDialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className={`container masthead ${communityStyles.masthead}`}>
          <Brand />
          <div className="masthead-note">
            Canada’s voice for
            <br />
            <strong>secure technology.</strong>
          </div>
          <div className="header-actions">
            <CommunityLinks />
            <button
              className="icon-button"
              aria-label="Search stories"
              onClick={() => searchDialog.current?.showModal()}
            >
              <Search size={21} strokeWidth={1.7} />
            </button>
            <Link className="button button-red header-cta" href="/stories">
              Explore the stories <ArrowUpRight size={17} />
            </Link>
            <button
              className="icon-button menu-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
        <div className="container nav-container">
          <nav
            id="main-navigation"
            className={`main-nav ${menuOpen ? "nav-open" : ""}`}
            aria-label="Main navigation"
          >
            <Link
              className="nav-home"
              href="/"
              onClick={() => setMenuOpen(false)}
            >
              The latest
              <span className="nav-dot" />
            </Link>
            {storyKinds.map((kind) => (
              <Link
                key={kind}
                href={`/stories?kind=${kind}`}
                onClick={() => setMenuOpen(false)}
              >
                {kind}
              </Link>
            ))}
            <Link
              className="nav-about"
              href="/about"
              onClick={() => setMenuOpen(false)}
            >
              About LVC <ArrowUpRight size={13} />
            </Link>
          </nav>
        </div>
      </header>
      <dialog
        className="search-dialog"
        ref={searchDialog}
        aria-labelledby="search-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget)
            searchDialog.current?.close();
        }}
      >
        <div className="search-panel">
          <div className="search-panel-heading">
            <span className="eyebrow">FIND YOUR SIGNAL</span>
            <button
              className="icon-button"
              aria-label="Close search"
              onClick={() => searchDialog.current?.close()}
            >
              <X size={24} />
            </button>
          </div>
          <h2 id="search-dialog-title">What’s on your radar?</h2>
          <form action="/search" onSubmit={() => searchDialog.current?.close()}>
            <label className="sr-only" htmlFor="site-search">
              Search stories
            </label>
            <div className="search-input-wrap">
              <Search size={22} />
              <input
                id="site-search"
                name="q"
                placeholder="Search stories, people, ideas…"
                required
                autoComplete="off"
                autoFocus
              />
              <button className="button button-red" type="submit">
                Search <ArrowUpRight size={16} />
              </button>
            </div>
          </form>
          <div className="search-topics">
            <span>EXPLORE A TOPIC</span>
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                onClick={() => searchDialog.current?.close()}
              >
                {topic.name} <ArrowUpRight size={13} />
              </Link>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
