<?php

/* template.twig */
class __TwigTemplate_5957f95aa307a1bb61588a16db3cbed4bf4aa4dcb24869175ac5e31be0432eb8 extends Twig_Template
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
        $context["current_language"] = $this->getAttribute((isset($context["languages"]) ? $context["languages"] : null), (isset($context["current_language_code"]) ? $context["current_language_code"] : null), array(), "array");
        // line 2
        $context["css_classes_flag"] = twig_trim_filter(("wpml-ls-flag " . $this->getAttribute((isset($context["backward_compatibility"]) ? $context["backward_compatibility"] : null), "css_classes_flag", array())));
        // line 3
        $context["css_classes_native"] = twig_trim_filter(("wpml-ls-native " . $this->getAttribute((isset($context["backward_compatibility"]) ? $context["backward_compatibility"] : null), "css_classes_native", array())));
        // line 4
        $context["css_classes_display"] = twig_trim_filter(("wpml-ls-display " . $this->getAttribute((isset($context["backward_compatibility"]) ? $context["backward_compatibility"] : null), "css_classes_display", array())));
        // line 5
        $context["css_classes_bracket"] = twig_trim_filter(("wpml-ls-bracket " . $this->getAttribute((isset($context["backward_compatibility"]) ? $context["backward_compatibility"] : null), "css_classes_bracket", array())));
        // line 6
        echo "
<div
\t class=\"";
        // line 8
        echo twig_escape_filter($this->env, (isset($context["css_classes"]) ? $context["css_classes"] : null), "html", null, true);
        echo " wpml-ls-legacy-dropdown js-wpml-ls-legacy-dropdown\"";
        if ($this->getAttribute((isset($context["backward_compatibility"]) ? $context["backward_compatibility"] : null), "css_id", array())) {
            echo " id=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["backward_compatibility"]) ? $context["backward_compatibility"] : null), "css_id", array()), "html", null, true);
            echo "\"";
        }
        echo ">
\t<ul>

\t\t<li tabindex=\"0\" class=\"";
        // line 11
        echo twig_escape_filter($this->env, $this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "css_classes", array()), "html", null, true);
        echo " wpml-ls-item-legacy-dropdown\">
\t\t\t<a href=\"#\" class=\"";
        // line 12
        echo twig_escape_filter($this->env, twig_trim_filter(("js-wpml-ls-item-toggle wpml-ls-item-toggle " . $this->getAttribute($this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "backward_compatibility", array()), "css_classes_a", array()))), "html", null, true);
        echo "\">";
        // line 13
        if ($this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "flag_url", array())) {
            // line 14
            echo "<img class=\"";
            echo twig_escape_filter($this->env, (isset($context["css_classes_flag"]) ? $context["css_classes_flag"] : null), "html", null, true);
            echo "\" src=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "flag_url", array()), "html", null, true);
            echo "\" alt=\"";
            echo twig_escape_filter($this->env, (isset($context["current_language_code"]) ? $context["current_language_code"] : null), "html", null, true);
            echo "\" title=\"";
            echo twig_escape_filter($this->env, $this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "flag_title", array()), "html", null, true);
            echo "\">";
        }
        // line 17
        if (($this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "display_name", array()) || $this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "native_name", array()))) {
            // line 18
            $context["current_language_name"] = (($this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "display_name", array(), "any", true, true)) ? (_twig_default_filter($this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "display_name", array()), $this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "native_name", array()))) : ($this->getAttribute((isset($context["current_language"]) ? $context["current_language"] : null), "native_name", array())));
            // line 19
            echo "<span class=\"";
            echo twig_escape_filter($this->env, (isset($context["css_classes_native"]) ? $context["css_classes_native"] : null), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, (isset($context["current_language_name"]) ? $context["current_language_name"] : null), "html", null, true);
            echo "</span>";
        }
        // line 21
        echo "</a>

\t\t\t<ul class=\"wpml-ls-sub-menu\">
\t\t\t\t";
        // line 24
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["languages"]) ? $context["languages"] : null));
        foreach ($context['_seq'] as $context["_key"] => $context["language"]) {
            if ( !$this->getAttribute($context["language"], "is_current", array())) {
                // line 25
                echo "
\t\t\t\t\t<li class=\"";
                // line 26
                echo twig_escape_filter($this->env, $this->getAttribute($context["language"], "css_classes", array()), "html", null, true);
                echo "\">
\t\t\t\t\t\t<a href=\"";
                // line 27
                echo twig_escape_filter($this->env, $this->getAttribute($context["language"], "url", array()), "html", null, true);
                echo "\" class=\"";
                echo twig_escape_filter($this->env, (isset($context["css_classes_link"]) ? $context["css_classes_link"] : null), "html", null, true);
                echo "\">";
                // line 28
                if ($this->getAttribute($context["language"], "flag_url", array())) {
                    // line 29
                    echo "<img class=\"";
                    echo twig_escape_filter($this->env, (isset($context["css_classes_flag"]) ? $context["css_classes_flag"] : null), "html", null, true);
                    echo "\" src=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute($context["language"], "flag_url", array()), "html", null, true);
                    echo "\" alt=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute($context["language"], "code", array()), "html", null, true);
                    echo "\" title=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute($context["language"], "flag_title", array()), "html", null, true);
                    echo "\">";
                }
                // line 32
                if ($this->getAttribute($context["language"], "native_name", array())) {
                    // line 33
                    echo "<span class=\"";
                    echo twig_escape_filter($this->env, (isset($context["css_classes_native"]) ? $context["css_classes_native"] : null), "html", null, true);
                    echo "\">";
                    echo twig_escape_filter($this->env, $this->getAttribute($context["language"], "native_name", array()), "html", null, true);
                    echo "</span>";
                }
                // line 35
                if ($this->getAttribute($context["language"], "display_name", array())) {
                    // line 36
                    echo "<span class=\"";
                    echo twig_escape_filter($this->env, (isset($context["css_classes_display"]) ? $context["css_classes_display"] : null), "html", null, true);
                    echo "\">";
                    // line 37
                    if ($this->getAttribute($context["language"], "native_name", array())) {
                        echo "<span class=\"";
                        echo twig_escape_filter($this->env, (isset($context["css_classes_bracket"]) ? $context["css_classes_bracket"] : null), "html", null, true);
                        echo "\"> (</span>";
                    }
                    // line 38
                    echo twig_escape_filter($this->env, $this->getAttribute($context["language"], "display_name", array()), "html", null, true);
                    // line 39
                    if ($this->getAttribute($context["language"], "native_name", array())) {
                        echo "<span class=\"";
                        echo twig_escape_filter($this->env, (isset($context["css_classes_bracket"]) ? $context["css_classes_bracket"] : null), "html", null, true);
                        echo "\">)</span>";
                    }
                    // line 40
                    echo "</span>";
                }
                // line 42
                echo "</a>
\t\t\t\t\t</li>

\t\t\t\t";
            }
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['language'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 46
        echo "\t\t\t</ul>

\t\t</li>

\t</ul>
</div>";
    }

    public function getTemplateName()
    {
        return "template.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  153 => 46,  143 => 42,  140 => 40,  134 => 39,  132 => 38,  126 => 37,  122 => 36,  120 => 35,  113 => 33,  111 => 32,  100 => 29,  98 => 28,  93 => 27,  89 => 26,  86 => 25,  81 => 24,  76 => 21,  69 => 19,  67 => 18,  65 => 17,  54 => 14,  52 => 13,  49 => 12,  45 => 11,  33 => 8,  29 => 6,  27 => 5,  25 => 4,  23 => 3,  21 => 2,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "template.twig", "/home/vg2peww8/public_html/wp-content/plugins/sitepress-multilingual-cms/templates/language-switchers/legacy-dropdown/template.twig");
    }
}
