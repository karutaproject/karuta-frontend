<?xml version="1.0"  encoding="UTF-8" ?>
<!DOCTYPE xsl:stylesheet [
<!ENTITY nbsp "&amp;#160;">
]>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<xsl:output method="xml" />
	<xsl:param name="lang">en</xsl:param>
	<xsl:template match="/">
		<model>
			<xsl:apply-templates select='//asmRoot/asmUnitStructure'/>
		</model>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='for-each-line']">
		<for-each-line>
			<xsl:apply-templates select='asmUnitStructure'/>
		</for-each-line>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='create-person']">
		<xsl:variable name="identifier">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='identifier']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="firstname">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='firstname']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="lastname">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='lastname']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="email">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='email']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="password">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='password']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="designer">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='designer']/asmResource[@xsi_type='Get_Resource']/code"></xsl:value-of>
		</xsl:variable>
		<create-user>
			<identifier>
				<txtval select='{$identifier}'/>
			</identifier>
			<firstname>
				<txtval select='{$firstname}'/>
			</firstname>
			<lastname>
				<txtval select='{$lastname}'/>
			</lastname>
			<email>
				<txtval select='{$email}'/>
			</email>
			<password>
				<txtval select='{$password}'/>
			</password>
			<designer>
				<txtval><xsl:value-of select="$designer"/></txtval>
			</designer>
		</create-user>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='delete-person']">
		<xsl:variable name="identifier">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='identifier']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<delete-user>
			<identifier>
				<txtval select='{$identifier}'/>
			</identifier>
		</delete-user>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='create-elgg-user']">
		<xsl:variable name="identifier">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='identifier']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="firstname">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='firstname']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="lastname">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='lastname']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="email">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='email']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="password">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='password']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<create-elgg-user>
			<identifier>
				<txtval select='{$identifier}'/>
			</identifier>
			<firstname>
				<txtval select='{$firstname}'/>
			</firstname>
			<lastname>
				<txtval select='{$lastname}'/>
			</lastname>
			<email>
				<txtval select='{$email}'/>
			</email>
			<password>
				<txtval select='{$password}'/>
			</password>
		</create-elgg-user>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='join-elgg-group']">
		<xsl:variable name="identifier">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='identifier']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<join-elgg-group>
			<identifier>
				<txtval select='{$identifier}'/>
			</identifier>
			<group>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">group</xsl:with-param>
				</xsl:call-template>
			</group>
		</join-elgg-group>
	</xsl:template>
		
	<xsl:template match="*[metadata/@semantictag='create-elgg-group']">
		<xsl:variable name="group">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='group']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<create-elgg-group>
			<group>
				<txtval select='{group}'/>
			</group>
		</create-elgg-group>
	</xsl:template>

	<xsl:template name='txtval'>
		<xsl:param name="semtag"/>
		<xsl:for-each select=".//*[metadata/@semantictag=$semtag]/*[metadata/@semantictag='txtsel' or metadata/@semantictag='txtval']">
			<xsl:if test="metadata/@semantictag='txtsel'">
				<xsl:variable name="txtsel">
					<xsl:value-of select="asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
				</xsl:variable>
				<txtval select='{$txtsel}'/>
			</xsl:if>
			<xsl:if test="metadata/@semantictag='txtval'">
				<xsl:variable name="txtval">
					<xsl:value-of select="asmResource[@xsi_type='Field']/text[@lang=$lang]"/>
				</xsl:variable>
				<txtval><xsl:value-of select="$txtval"/></txtval>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='create-tree']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='treeid']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<create-tree id="{$id}">
			<template>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">tree-template</xsl:with-param>
				</xsl:call-template>
			</template>
			<code>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">tree-code</xsl:with-param>
				</xsl:call-template>
			</code>
			<label>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">tree-label</xsl:with-param>
				</xsl:call-template>
			</label>
		</create-tree>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-tree-root']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='treeid']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-tree-root id="{$id}">
			<oldcode>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">tree-oldcode</xsl:with-param>
				</xsl:call-template>
			</oldcode>
			<newcode>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">tree-newcode</xsl:with-param>
				</xsl:call-template>
			</newcode>
			<label>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">tree-label</xsl:with-param>
				</xsl:call-template>
			</label>
		</update-tree-root>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='select-tree']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='treeid']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<select-tree id="{$id}">
			<code>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">code</xsl:with-param>
				</xsl:call-template>
			</code>
		</select-tree>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='delete-tree']">
		<delete-tree>
			<code>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">code</xsl:with-param>
				</xsl:call-template>
			</code>
		</delete-tree>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='share-tree']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<share-tree select="{$id}">
			<user>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">person</xsl:with-param>
				</xsl:call-template>
			</user>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</share-tree>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='join-portfoliogroup']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<join-portfoliogroup select="{$id}">
			<portfoliogroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">groupname</xsl:with-param>
				</xsl:call-template>
			</portfoliogroup>
		</join-portfoliogroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='unshare-tree']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<unshare-tree select="{$id}">
			<user>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">person</xsl:with-param>
				</xsl:call-template>
			</user>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</unshare-tree>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='share-usergroup']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<share-usergroup select="{$id}">
			<groupname>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">groupname</xsl:with-param>
				</xsl:call-template>
			</groupname>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</share-usergroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='unshare-usergroup']">
		<xsl:variable name="id">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='tree-select']/asmResource[@xsi_type='Get_Resource']/label[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<unshare-usergroup select="{$id}">
			<groupname>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">groupname</xsl:with-param>
				</xsl:call-template>
			</groupname>
			<role>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">role</xsl:with-param>
				</xsl:call-template>
			</role>
		</unshare-usergroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='moveup-node']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<moveup-node type='Field' select="{$select}">
		</moveup-node>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-field']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Field' select="{$select}">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-node-resource']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='NodeResource' select="{$select}">
			<newcode>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">node-code</xsl:with-param>
				</xsl:call-template>
			</newcode>
			<label>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">node-label</xsl:with-param>
				</xsl:call-template>
			</label>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-metadata-query']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='MetadatawadQuery' select="{$select}">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-metadata-menu']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='MetadatawadMenu' select="{$select}">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-metadata-inline']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='MetadataInline' select="{$select}">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-metadata']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="attribute">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='attribute']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Metadata' select="{$select}" attribute="{$attribute}">
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-rights']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="rd">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='rd']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="wr">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='wr']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="dl">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='dl']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="sb">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='sb']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type="Rights" select="{$select}" rd="{$rd}" wr="{$dl}" dl="{$dl}" sb="{$sb}"/>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-metadata-wad']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="attribute">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='attribute']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Metadatawad' select="{$select}" attribute="{$attribute}">
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-proxy']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='proxy-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Proxy' select="{$select}">
			<source select="{$source}"/>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='update-dashbrd']">
		<xsl:variable name="select">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="source">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<update-resource type='Dashboard' select="{$select}">
			<xsl:if test="$source!=''">
				<source select="{$source}"/>
			</xsl:if>
			<text>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">text</xsl:with-param>
				</xsl:call-template>
			</text>
		</update-resource>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='import-node']">
		<xsl:variable name="srce">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='source-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<xsl:variable name="dest">
			<xsl:value-of select=".//asmContext[metadata/@semantictag='destination-select']/asmResource[@xsi_type='Field']/text[@lang=$lang]"></xsl:value-of>
		</xsl:variable>
		<import-node select="{$dest}" source="{$srce}">
			<source>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">import-source</xsl:with-param>
				</xsl:call-template>
			</source>
		</import-node>
	</xsl:template>
	
	<xsl:template match="*[metadata/@semantictag='join-usergroup']">
		<join-usergroup>
			<user>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">person</xsl:with-param>
				</xsl:call-template>
			</user>
			<usergroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">usergroup</xsl:with-param>
				</xsl:call-template>
			</usergroup>
		</join-usergroup>
	</xsl:template>

	<xsl:template match="*[metadata/@semantictag='leave-usergroup']">
		<leave-usergroup>
			<user>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">person</xsl:with-param>
				</xsl:call-template>
			</user>
			<usergroup>
				<xsl:call-template name="txtval">
					<xsl:with-param name="semtag">usergroup</xsl:with-param>
				</xsl:call-template>
			</usergroup>
		</leave-usergroup>
	</xsl:template>
	

</xsl:stylesheet>

 