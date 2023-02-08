<?php

/* layout-slot-edit-button.twig */
class __TwigTemplate_dc27b421b2b3cc5ba30e7bc74bf1c2cf64bd7aa88966355396af478e0e72f008 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        ob_start();
        // line 2
        if (((isset($context["action"]) ? $context["action"] : null) == "edit")) {
            // line 3
            echo "\t";
            $context["class"] = "otgs-ico-edit";
        } else {
            // line 5
            echo "\t";
            $context["class"] = "otgs-ico-add";
        }
        // line 7
        echo "
<p class=\"wpml-ls-slot-management-link-wrapper\">
\t<a href=\"";
        // line 9
        echo twig_escape_filter($this->env, (isset($context["url"]) ? $context["url"] : null), "html", null, true);
        echo "\" class=\"js-wpml-ls-slot-management-link button-secondary\">
\t\t<span class=\"";
        // line 10
        echo twig_escape_filter($this->env, (isset($context["class"]) ? $context["class"] : null), "html", null, true);
        echo "\"></span> ";
        echo twig_escape_filter($this->env, (isset($context["label"]) ? $context["label"] : null), "html", null, true);
        echo "</a>
</p>
";
        echo trim(preg_replace('/>\s+</', '><', ob_get_clean()));
    }

    public function getTemplateName()
    {
        return "layout-slot-edit-button.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  39 => 10,  35 => 9,  31 => 7,  27 => 5,  23 => 3,  21 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "layout-slot-edit-button.twig", "/home/vg2peww8/public_html/wp-content/plugins/sitepress-multilingual-cms/templates/language-switcher-admin-ui/layout-slot-edit-button.twig");
    }
}
