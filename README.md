# Scholia
> noun, plural of *scholium* (New Latin); originally from Ancient Greek *σχόλιον* (skhólion, “comment”), derived from *σχολή* (skholḗ, “discussion”)
> 
> — a set of explanatory or exegetical comments, often in the form of marginal notes on a text


**Description:** 

Scholia is a platform for writing commentaries in a collaborative, group based environment. 

This project is inspired by the pedagogical tradition of commentary writing, which flourished through the Classical, Medieval, and Early-Modern periods. The aim of Scholia is to reimagine this in the context of contemporary web technology. 

In Scholia, all content is centered around groups; documents are uploaded to groups and shared in common among their members. Group members may then create commentaries for these documents, or read those created by other members.

--- 

**Technical Highlights:**

Scholia is currently separated into two main parts: the dashboard and the commentary tool. The commentary tool is the main feature of Scholia where documents are read and commentaries are written. 

Documents are displayed using both the react-pdf library, which provides a basic framework for rendering documents and static page components, and an original solution that allows for rendering the pages in a continuous and scrollable column. The page components have been set up to procedurally load in a way that accommodates jumping through different sections of the document as needed according to the different sections of the commentary.

Commentaries are associated with specific documents and consist in an arbitrary number of sections. Commentary sections contain text written by the user, and are associated with specific pages in the document as well as coordinates on the page selected by the user. The selections are then rendered on the page as highlighted areas which may be interacted with in navigating through the document, or jumped to in navigating through the commentary. 

---

This project is a work in progress — suggestions for features to add or bugs to fix are welcome!
